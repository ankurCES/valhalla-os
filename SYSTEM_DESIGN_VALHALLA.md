# SYSTEM_DESIGN_VALHALLA.md

# Project Valhalla: Unified AI & Data Sovereign

## 1. Vision
A unified enterprise portal that provides a single glass pane for Conversational AI, Visual Automation, and Business Intelligence by integrating three industry-leading open-source platforms.

## 2. Integrated Core Systems
- **Chat Interface:** Open WebUI (SvelteKit/FastAPI)
- **Workflow Engine:** n8n (Node.js/TypeScript)
- **Analytics & BI:** Apache Superset (Python/React)

## 3. Architectural Strategy: "The Portal Bridge"
Instead of a code-level merge (which would be unstable and unmaintainable), Valhalla uses a **Micro-Frontend / Service-Proxy** architecture.

### A. Valhalla Shell (The Orchestrator)
- **Tech:** SvelteKit + Tailwind CSS.
- **Role:** Handles global navigation, user authentication, and role management.
- **Integration:** Embeds the sub-services via secured IFrames or direct component injection using their respective APIs.

### B. Traffic & Routing (Gateway)
- **Tech:** Traefik or Nginx.
- **Routing:**
    - `/` -> Valhalla Shell UI
    - `/chat` -> Open WebUI backend/frontend
    - `/workflow` -> n8n instance
    - `/analytics` -> Superset instance

### C. Unified Authentication (The Asgardian Shield)
- **Tech:** PostgreSQL-backed SSO bridge.
- **Flow:** User logs into Valhalla Shell -> Shell issues JWT/Session -> Shell proxies auth headers to n8n, Superset, and Open WebUI to ensure a single sign-on experience.

## 4. Role-Based Access Control (RBAC)
| Feature | Admin Role | Regular User Role |
| :--- | :--- | :--- |
| **Chat** | Model Config, System Prompts | Standard Chat |
| **Workflows** | Create/Edit Nodes & DAGs | Trigger/Execute only |
| **Dashboards** | Add Data Sources, Create Charts | View-only dashboards |
| **Integrations** | Full REST/SQL endpoint config | No access |

## 5. Implementation Phases
1. **Phase 1: Multi-Container Setup.** Orchestrate the three base repos via a master Docker Compose.
2. **Phase 2: The Valhalla Shell.** Build the SvelteKit sidebar navigation.
3. **Phase 3: Auth Proxying.** Implement the header-based SSO for the sub-services.
4. **Phase 4: Role Enforcement.** Hide/Show UI elements based on JWT claims.

---
**Architect:** Tesla | **Signed:** Odin
