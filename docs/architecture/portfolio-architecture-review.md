# Portfolio Architecture Specification — Review

**Reviewed:** 2026-08-18  
**Subject:** `portfolio-architecture-spec.md` (Design Session v0.1)  
**Status:** Advisory — recommendations for ratification before implementation

## Overall assessment

The specification has a coherent purpose: Portfolio is a public engineering artefact, so the
additional cost of Module Federation and microservices is an intentional demonstration rather than
an accidental overbuild. D11 is the right separation: `davejackson.dev` remains a writing and
presence site, while `portfolio.davejackson.dev` can independently demonstrate the engineering
work.

The primary risk is not Module Federation. It is retaining seven contexts and three datastores
after D11 has moved articles out of Portfolio. Resolve that scope before scaffolding.

## Recommended decisions

1. **Ratify D11.** Keep Portfolio as a separately deployed product at
   `portfolio.davejackson.dev`, linked prominently from `davejackson.dev`.
2. **Do not create a Portfolio Content context for v1.** Case-study prose belongs to Projects;
   long-form articles remain in LeanAgileOS. Start with reciprocal hyperlinks between sites. This
   removes CouchDB/Nouveau, one API, one UI remote, and unnecessary cross-site runtime coupling.
3. **Deploy Portfolio publicly.** A public repository demonstrates source code; a live deployment
   demonstrates operability, UX, security posture, and real MFE integration. Resolve OQ6 as yes.
4. **Make Identity admin-only for v1.** Public Project/Profile/Skill routes should be anonymous.
   Use an external OIDC provider for Admin rather than building an IdP. The valuable evidence is a
   secure integration, authorization model, and tests—not an unnecessarily large security
   perimeter.
5. **Use static prerendering for public routes.** Dropping SSR does not mean giving up SEO or
   performance. Prerender public pages and include route metadata, sitemap, canonical URLs, and
   social cards.
6. **Keep the shared-platform repository deferred.** Adopt a workspace or Git dependency before
   package publication if a real shared need appears. Extract one stable library only after
   Portfolio demonstrates a second real consumer.

## Architecture changes to make explicit

### Gateway and authentication

Do not introspect tokens on every request. The gateway should validate signed bearer tokens using
cached issuer signing keys, with short token lifetimes and key rotation. Backend services should be
reachable only on the internal network and receive a verified-principal contract from the gateway.

### PostgreSQL isolation

"One database per service" should mean a separate database or schema, database credentials, and
migration ownership for each context—even if the initial deployment is one PostgreSQL container.
Services must never read another context's tables directly.

### Cross-service events

NestJS's local CQRS `EventBus` does not cross process boundaries. Before claiming that
cross-context writes occur through domain events, define an integration-event contract and a
transactional outbox/publisher mechanism. Alternatively, defer cross-service side effects until
that mechanism exists. Gateway composition should remain read-only.

### Phase sequencing

Combine the minimum of Phase 02 with Phase 03: build the shell, gateway, nginx/Compose network,
and Projects vertical slice together. This produces an end-to-end proof earlier and avoids a
polished but empty platform scaffold.

## Risks worth retaining

- Run Spike 0 before committing to the federation implementation; the present workspace uses
  Angular 22/Nx 23 and `@angular/build`, with no Module Federation configuration.
- Preserve D7: the spike selects an MFE implementation, not whether MFEs exist.
- Treat public-repository controls as Phase 01 prerequisites: ignore real environment files,
  enable GitHub secret scanning/push protection, configure branch rules, add CI, a license, and a
  substantive README.
- A public deployed hostname is not secret. The policy should prohibit private/internal endpoints,
  credentials, and personal data in committed configuration or fixtures.

## Specification cleanup required before ratification

- The document contains two sections titled "13. Proposed phase sequence". The first is retained
  D10 analysis and should be removed or placed in a clearly superseded-decision appendix.
- Several D10 consequences are still phrased as active despite D11 superseding D10.
- Section number 10 is reused for the public-repository posture; renumber it or make it a
  subsection.
- The transfer table says BMC/VPC artifacts transfer "wholesale," while D11 permits only the
  Portfolio/Case-Study slice. Reconcile the language.

## Suggested ratification order

1. D11 and the Workshop 8 scope re-cut.
2. No Content context / no CouchDB-Nouveau in Portfolio v1.
3. External OIDC for Admin only, with a public-site anonymous access model.
4. Static prerendering and the initial hyperlink-only cross-site seam.
5. Integration-event/outbox ADR before cross-service event handling.
6. Module Federation Spike 0, followed by the Projects end-to-end vertical slice.
