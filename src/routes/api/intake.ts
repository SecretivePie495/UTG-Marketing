import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/intake")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          ok: true,
          endpoint: "/api/intake",
          method: "POST",
          description: "Submit a lead-generation intake form.",
        }),

      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
        }

        // Re-validate on the server with the shared Zod schema.
        const { intakeSchema } = await import("@/lib/intake-schema");
        const parsed = intakeSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            {
              ok: false,
              error: "Validation failed.",
              issues: parsed.error.issues.map((i) => ({
                path: i.path,
                message: i.message,
              })),
            },
            { status: 422 },
          );
        }

        // Stable, opaque reference id for this submission.
        const id = `intake_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

        const record = { id, ...parsed.data };

        // Server-side conversion pixel (no-op until OAIQ_API_KEY is set).
        const { fireLeadCreated } = await import("@/lib/oaiq-conversion");
        fireLeadCreated({ eventId: id, sourceUrl: request.url });

        // Optional: forward to an n8n (or any) webhook. Set
        // N8N_INTAKE_WEBHOOK_URL via the secrets tool to enable.
        const webhookUrl = process.env.N8N_INTAKE_WEBHOOK_URL;
        if (webhookUrl) {
          try {
            await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(record),
            });
          } catch {
            // Swallow forward errors — intake is still recorded locally.
          }
        }

        return Response.json({ ok: true, id, receivedAt: record.createdAt });
      },
    },
  },
});
