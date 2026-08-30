# Silicon Epoch

> **The evolution of AI made visible.**

Silicon Epoch is an interactive visual knowledge graph of AI evolution. Its core concept is to represent research ideas, papers, architectures, models, hardware, organizations, products, and their relationships as an explorable spatial timeline rather than a conventional list or directory.

## Product thesis

Silicon Epoch is designed around a simple question:

> How did today's AI systems emerge from the ideas, research, architectures, hardware, and products that came before them?

The primary experience is a desktop-first, cinematic 3D exploration. Conventional 2D UI remains responsible for dense information such as specifications, comparisons, citations, search, and filters.

## Experience

```text
Landing / orientation
        ↓
Exploration
        ↓
Discovery
        ↓
Entity inspection
        ↓
Lineage exploration
        ↓
Comparison
```

The 3D environment uses spatial properties to communicate meaning: position can represent time or grouping, shape can represent entity type, size can represent normalized significance, and traces can represent typed relationships.

## Knowledge graph

The architecture separates **entities** from **relationships**.

Example entity types include:

```text
concept · paper · algorithm · architecture · model · dataset
benchmark · hardware · software · organization · product · event
```

Relationships are typed rather than represented as anonymous links, allowing the system to express concepts such as:

```text
influenced · introduced · derived_from · successor_to
trained_on · evaluated_on · implemented_by · developed_by
released_by · requires · accelerated_by · commercialized_as
```

## Evidence model

The project is explicitly designed around provenance rather than filling gaps with invented technical facts. Meaningful factual fields are intended to retain source information, retrieval time, confidence, and notes where available.

Unknown values should remain unknown.

## Visual principles

- **Spatial information should carry meaning.** 3D is used for relationships, hierarchy, lineage, and time.
- **2D is used for information density.** Specifications, benchmarks, pricing, citations, search, and comparisons should remain readable.
- **Precision over cyberpunk.** The intended visual language is closer to a precision hardware laboratory and semiconductor visualization than a generic futuristic dashboard.
- **Evidence over apparent certainty.** Visual completeness must never require fabricated data.

## Architecture

The detailed build-ready product and architecture specification is:

[`docs/Silicon_Epoch_Architecture_V2.md`](docs/Silicon_Epoch_Architecture_V2.md)

The current application is implemented as a Next.js/React project with TypeScript, Tailwind CSS, Three.js via React Three Fiber, Framer Motion, GSAP, and Zustand. Playwright is included in development dependencies for browser-level testing.

## Repository structure

```text
src/
├── app/          # Next.js application routes and pages
├── components/   # Reusable UI / 3D components
├── data/         # Application data
├── lib/          # Shared application logic
└── types/        # TypeScript types

docs/
└── Silicon_Epoch_Architecture_V2.md

scripts/          # Project scripts
tests/            # Test suite
public/           # Static assets
```

## Quick start

Requirements: a current Node.js installation and npm.

```bash
git clone https://github.com/anonyxhappie/silicon-epoch.git
cd silicon-epoch
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm start
```

## Project status

The repository is an actively developed implementation of the Silicon Epoch V2 product/architecture direction. The architecture document is intentionally more comprehensive than the current application implementation; features should be considered implemented only when they exist in the codebase.

## License

See the repository for the current licensing status.
