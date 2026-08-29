# Silicon Epoch — Product & Architecture Document (V2)
## The Explorable 3D Knowledge Graph of AI Evolution
### Motherboard + Silicon + Timeline + Lineage + Evidence

**Status:** Build-ready V2 specification  
**Primary audience:** Tech enthusiasts, AI researchers, developers, students, and technically curious users  
**Primary experience:** Desktop-first, cinematic, interactive 3D exploration  
**Secondary experience:** Simplified tablet/mobile exploration  
**Core metaphor:** A massive precision-engineered motherboard representing the evolution of AI through time. Research ideas, papers, architectures, models, hardware, organizations, and products appear as physical silicon/electronic objects connected by traces that represent meaningful relationships.

---

# 0. Product Thesis

Silicon Epoch is not an AI directory and not merely a 3D timeline.

It is an **explorable visual knowledge graph of AI evolution**.

The primary spatial axis is time, but time is only one dimension. The system should reveal how:

```text
Ideas
  ↓
Research
  ↓
Architectures
  ↓
Models
  ↓
Infrastructure
  ↓
Products
```

influence one another across decades.

The user should feel that they are physically travelling through the history of computing and AI rather than scrolling through a conventional website.

### Product promise

> **See how AI evolved, rather than simply reading about it.**

---

# 1. Product Principles

## 1.1 Spatial information should carry meaning

Every major visual property must communicate information.

Examples:

- Position → time / conceptual grouping
- Size → scale, significance, or compute-derived visual weight
- Shape → entity or architecture type
- Material → category / state
- Port configuration → modality or capability
- Trace → relationship
- Trace direction → relationship direction
- Trace style → relationship type
- Glow intensity → relevance / activity
- Elevation → hierarchy
- Transparency → uncertainty or secondary importance

No major visual element should exist purely because it "looks futuristic."

## 1.2 3D is for relationships; 2D is for information density

Use 3D for:

- exploration
- scale
- hierarchy
- spatial relationships
- lineage
- time
- cinematic transitions

Use conventional 2D UI for:

- specifications
- descriptions
- benchmark tables
- pricing
- citations
- search
- filters
- dense comparisons

Do not force dense information into 3D.

## 1.3 Precision over cyberpunk

The visual direction is:

**precision hardware laboratory + semiconductor visualization + premium product visualization + futuristic museum**

Avoid turning the site into a generic cyberpunk dashboard.

The design should feel engineered, intentional, restrained, and expensive.

## 1.4 Evidence over apparent certainty

Technical facts should never be invented merely to make the visualization complete.

Every meaningful factual field should eventually support provenance:

```text
value
source
source_type
source_url
retrieved_at
confidence
notes
```

Unknown values should remain unknown.

---

# 2. Experience Architecture

The application has six major experiences:

```text
1. LANDING / ORIENTATION
          ↓
2. EXPLORATION
          ↓
3. DISCOVERY
          ↓
4. ENTITY INSPECTION
          ↓
5. LINEAGE EXPLORATION
          ↓
6. COMPARISON
```

The system should make all six feel like one continuous environment rather than separate web pages.

---

# 3. Landing Experience

## 3.1 First impression

On first load, the user sees a dark, deep-space / hardware-lab environment.

The motherboard extends beyond the visible viewport.

A glowing central trace represents time.

Minimal typography introduces the experience:

```text
SILICON EPOCH

THE EVOLUTION OF AI
MADE VISIBLE
```

The camera starts at a carefully composed overview rather than immediately dropping the user into dense content.

## 3.2 Entry interaction

Suggested interaction:

```text
[ ENTER THE EPOCH ]
```

After activation:

1. Ambient elements wake up.
2. Timeline trace energizes.
3. The camera begins moving.
4. Important historical nodes briefly illuminate.
5. The user receives a subtle orientation cue.
6. Manual control becomes primary.

Do not make the intro long. The user should reach the actual product quickly.

---

# 4. World / Motherboard Architecture

## 4.1 Board

The motherboard is an enormous navigable 3D surface.

Visual language:

- matte black PCB
- dark translucent/glass layers
- precision-machined edges
- subtle metallic surfaces
- restrained emissive traces
- fine grid markings
- labels and silkscreen-style annotations
- depth layers
- controlled atmospheric lighting

Avoid excessive fog, bloom, particles, or lens effects.

## 4.2 Primary timeline

The main timeline is a physical trace traveling through the motherboard.

Conceptually:

```text
1950s ─────── 1960s ───── 1970s ───── 1980s ─────
                                              \
                                               1990s ─── 2000s
                                                            \
                                                             2010s ─── 2020s ─── NOW
```

The exact geometry can be curved and cinematic, but the temporal order must remain obvious.

## 4.3 Epoch zones

Initial conceptual zones:

```text
The Foundations
The Symbolic Era
The Connectionist Era
The Statistical Learning Era
The Deep Learning Boom
The Transformer Era
The Foundation Model Era
The Agentic / Multimodal Era
```

These labels are conceptual categories and should be refined as the data grows.

Epoch boundaries should affect:

- board geometry
- material treatment
- secondary trace behavior
- typography
- labels
- ambient visual language

Do not rely only on color changes to communicate epochs.

---

# 5. Knowledge Graph Model

The central architectural improvement over V1 is to model **entities and relationships separately**.

## 5.1 Entity types

The system should support at least:

```text
concept
paper
algorithm
architecture
model
model_family
dataset
benchmark
hardware
software
organization
product
event
person
```

The first release may contain fewer entity types, but the schema must not prevent future expansion.

## 5.2 Relationship types

Relationships must be typed.

Examples:

```text
influenced
introduced
derived_from
successor_to
predecessor_of
variant_of
trained_on
evaluated_on
implemented_by
developed_by
released_by
requires
accelerated_by
used_in
commercialized_as
related_to
```

Never reduce all relationships to:

```json
"lineage": ["id1", "id2"]
```

because that destroys semantic meaning.

## 5.3 Graph model

Canonical relationship representation:

```json
{
  "source": "transformer",
  "target": "bert",
  "type": "influenced",
  "directional": true,
  "confidence": "high",
  "sources": ["source-transformer-paper"]
}
```

---

# 6. Visual Grammar

The visual system must be deterministic.

## 6.1 Entity shape

Suggested mapping:

```text
Concept       → abstract die / geometric core
Paper         → thin stacked silicon plate
Algorithm     → compact logic package
Architecture  → layered processor package
Model         → primary chip
Hardware      → processor / accelerator package
Dataset       → memory-bank style module
Benchmark     → measurement / instrumentation module
Organization  → motherboard subassembly
Product       → finished system / device
Event         → illuminated board marker
```

The actual geometry may evolve, but the semantic mapping must remain stable.

## 6.2 Model chip

A model's visual identity may encode:

- architecture
- modality
- scale
- openness
- model family
- generation
- status

Avoid creating a completely unique model for every entity. Use composable primitives.

Example:

```text
Base package
+ architecture geometry
+ port configuration
+ generation marking
+ scale
+ emissive details
```

## 6.3 Size mapping

Do **not** use raw parameter count as physical size.

The visual footprint should be derived from a normalized visual-scale function.

Conceptually:

```text
visual_size =
    f(
      parameter_scale,
      active_parameter_scale,
      compute_scale,
      historical_context,
      product_significance
    )
```

The function must include hard minimum and maximum bounds.

No single modern model should be allowed to consume the entire visual world simply because one metric is large.

## 6.4 Hardware scale

Infrastructure can be represented as larger assemblies:

```text
chip
  ↓
board
  ↓
server
  ↓
rack
  ↓
cluster
  ↓
datacenter
```

This allows infrastructure to coexist with software entities without pretending that the two are identical things.

---

# 7. Lineage & Relationship Traces

## 7.1 Trace semantics

Lineage traces are not decoration.

Each trace represents a typed relationship.

Examples:

```text
solid trace      → direct successor / family relationship
dashed trace     → conceptual influence
multi-branch     → fan-out influence
feedback loop    → iterative / feedback relationship
faint trace      → secondary relationship
```

## 7.2 Trace rendering

At large scale:

```text
Far away
→ simplified glowing line
```

At medium scale:

```text
→ visible relationship trace
```

Near the selected entity:

```text
→ high-detail directional path
→ relationship label
→ source evidence
```

## 7.3 Relationship filtering

Users should be able to isolate:

```text
All
Direct lineage
Architectural influence
Research influence
Model family
Hardware dependency
Organization
Product
```

---

# 8. Timeline Navigation — "The Glide"

Scrolling should control camera progression rather than simply moving a document scrollbar.

## 8.1 Navigation model

Input:

```text
mouse wheel
trackpad
touch drag
keyboard
```

Output:

```text
camera target position
camera target orientation
timeline progress
```

Use eased motion and damping.

Avoid excessive acceleration that causes motion sickness.

## 8.2 Camera states

Define explicit camera states:

```text
OVERVIEW
TRAVEL
FOCUS
INSPECT
EXPLODED
COMPARE
RETURN
```

The camera controller must transition between these states deterministically.

## 8.3 Camera path

The camera should follow a navigable spline / path rather than simply changing:

```text
camera.position.x += scroll
```

The path may include:

- controlled horizontal travel
- gentle vertical parallax
- occasional perspective shifts
- epoch-specific composition

However, user orientation must remain stable enough to preserve spatial understanding.

---

# 9. Exploded CAD Teardown

This is the flagship interaction.

## 9.1 Trigger

User selects a chip/entity.

Potential triggers:

```text
click
tap
Enter
keyboard selection
search result
deep link
```

## 9.2 Transition

Sequence:

```text
User selects entity
        ↓
World slows
        ↓
Unrelated traces dim
        ↓
Camera approaches
        ↓
Chip becomes dominant
        ↓
Background depth increases
        ↓
Chip separates into semantic layers
        ↓
Information overlays appear
```

## 9.3 Exploded layers

Suggested structure:

### Layer 1 — Identity

```text
Name
Creator
Release date
Type
Generation
Model family
```

### Layer 2 — Architecture

```text
Architecture
Parameters
Active parameters
Modalities
Context window
Training approach
```

### Layer 3 — Capability

```text
Benchmarks
Known capabilities
Strengths
Known limitations
```

### Layer 4 — Infrastructure

```text
Compute
Hardware
Training scale
Inference characteristics
```

### Layer 5 — Economics

```text
API pricing
Estimated compute economics
Availability
License
```

### Layer 6 — Evidence

```text
Primary sources
Technical reports
Papers
Documentation
Notes
Confidence
```

Not every entity needs every layer.

---

# 10. Information Density Rules

At any one moment:

```text
Primary object
+ 3–6 important labels
+ one dominant interaction
```

Do not expose twenty metrics simultaneously.

Use progressive disclosure.

Example:

```text
Model
 ├─ Overview
 ├─ Architecture
 ├─ Benchmarks
 ├─ Infrastructure
 ├─ Lineage
 └─ Sources
```

---

# 11. Search & Discovery

Search is a first-class feature.

## 11.1 Search behavior

When a user searches:

```text
GPT-4
```

the system should:

1. Find matching entities.
2. Display compact results.
3. Allow keyboard navigation.
4. Fly the camera to the selected entity.
5. Enter focus mode.
6. Highlight related nodes.

## 11.2 Search types

Support:

```text
Exact entity search
Fuzzy search
Organization search
Architecture search
Era search
Category search
Relationship search
```

Future natural-language queries may include:

```text
models influenced by the Transformer
open models released after 2023
vision-language models
models derived from BERT
```

The data layer should not prevent this future functionality.

---

# 12. Filters

Minimum useful filters:

```text
ERA
ENTITY TYPE
ORGANIZATION
ARCHITECTURE
MODALITY
OPEN / CLOSED
MODEL FAMILY
DATE RANGE
PARAMETER SCALE
COMPUTE SCALE
```

Filtering should alter the world itself:

```text
selected entities → brighter
non-matching entities → dimmed
irrelevant traces → hidden
matching relationships → emphasized
```

Do not completely destroy spatial context by removing everything from the scene.

---

# 13. Versus Mode

## 13.1 Trigger

Users can:

```text
Shift-click two entities
drag entities into compare dock
select Compare from entity panel
```

## 13.2 Comparison view

The system temporarily re-composes the camera:

```text
Entity A              Entity B
   ↓                     ↓
3D chip                3D chip
   \                     /
    \                   /
     comparison space
```

Comparison should include:

```text
Release
Architecture
Parameter scale
Context
Benchmarks
Modalities
Pricing
License
Hardware
Known capabilities
```

Only compare fields that are actually comparable.

Unknown values should display as:

```text
Not publicly disclosed
```

rather than zero.

## 13.3 Visual comparison

Possible visualizations:

```text
radar chart
metric bars
relative scale
timeline positioning
architecture differences
```

Avoid radar charts when too many dimensions make them visually misleading.

---

# 14. Data Architecture

## 14.1 Canonical structure

Recommended top-level structure:

```json
{
  "entities": [],
  "relationships": [],
  "sources": [],
  "epochs": [],
  "visual_config": {}
}
```

## 14.2 Entity schema

Example:

```json
{
  "id": "gpt-4-turbo",
  "type": "model",
  "name": "GPT-4 Turbo",
  "aliases": [],
  "creator": "org-openai",
  "release_date": "2023-11-06",
  "category": "multimodal_llm",
  "model_family": "gpt-4",
  "architecture": {
    "type": "transformer",
    "subtype": "moe",
    "publicly_disclosed": false
  },
  "parameters": {
    "total_billion": null,
    "active_billion": null
  },
  "context_window": {
    "value": 128000,
    "unit": "tokens"
  },
  "benchmarks": [],
  "pricing": [],
  "modalities": [
    "text",
    "image"
  ],
  "license": null,
  "availability": "api",
  "visual": {
    "entity_shape": "model_chip",
    "importance": 0.9
  },
  "sources": [
    "source-openai-release"
  ]
}
```

Do not populate undisclosed values with guesses.

## 14.3 Benchmark schema

```json
{
  "benchmark_id": "mmlu",
  "score": 86.4,
  "unit": "percent",
  "setting": "5-shot",
  "source": "source-example"
}
```

A benchmark score without evaluation conditions is potentially misleading.

## 14.4 Pricing schema

```json
{
  "currency": "USD",
  "unit": "1M_tokens",
  "input": 10.0,
  "output": 30.0,
  "effective_date": "2023-11-06",
  "source": "source-example"
}
```

Pricing must be versioned because it changes over time.

---

# 15. Evidence / Provenance Layer

Every factual object should be designed to support evidence.

## 15.1 Source types

```text
official documentation
technical report
research paper
model card
company announcement
benchmark paper
repository
academic publication
credible secondary source
```

## 15.2 Source object

```json
{
  "id": "source-transformer-paper",
  "type": "research_paper",
  "title": "Attention Is All You Need",
  "url": "...",
  "publisher": "...",
  "published_date": "2017-06-12",
  "retrieved_at": "...",
  "authority": "primary"
}
```

## 15.3 Evidence UI

The user should be able to ask:

> "Where did this fact come from?"

and immediately see the source.

The visual experience should preserve provenance without cluttering the main scene.

---

# 16. Deep Linking

Every meaningful entity should have a stable URL.

Example:

```text
/silicon/gpt-4
/silicon/transformer
/silicon/bert
```

Opening an entity link should:

1. Load the required scene state.
2. Position the camera.
3. Focus the entity.
4. Open its inspection state.

This makes the visualization shareable.

---

# 17. Responsive Architecture

## 17.1 Desktop

Full experience:

```text
large 3D scene
complex camera travel
rich lineage
full exploded teardown
comparison mode
```

## 17.2 Tablet

Simplify:

```text
reduced scene density
less geometry
fewer relationships
simplified overlays
```

## 17.3 Mobile

Do not simply shrink desktop.

Use:

```text
cinematic 2D / 2.5D timeline
+
selective 3D object presentation
+
swipe navigation
+
focused entity views
```

Mobile should preserve the conceptual identity even if the full motherboard is not rendered.

---

# 18. Performance Architecture

Target:

```text
60 FPS desktop on modern hardware
responsive interaction
minimal input latency
```

## 18.1 Level of detail

Required LOD strategy:

```text
DISTANT
small emissive proxy

MID
simplified chip geometry

NEAR
full chip geometry

SELECTED
full geometry + exploded internals
```

## 18.2 Instancing

Use instancing for repeated geometry.

Examples:

```text
PCB components
vias
pins
trace markers
repeated chip bodies
```

## 18.3 Relationship culling

Never render every relationship in maximum detail simultaneously.

Use:

```text
viewport relevance
camera distance
selected-node relevance
relationship type
filter state
```

## 18.4 Progressive loading

Recommended order:

```text
application shell
      ↓
basic motherboard
      ↓
timeline
      ↓
visible entity metadata
      ↓
3D assets
      ↓
deep entity data
      ↓
secondary relationships
```

## 18.5 GPU budget

Effects such as:

```text
bloom
particles
volumetrics
shadows
post-processing
```

must be treated as budgeted features rather than defaults.

The scene must remain useful with expensive effects disabled.

---

# 19. Rendering Architecture

## 19.1 Recommended stack

```text
Framework
Next.js + React

3D
Three.js + react-three-fiber

3D utilities
@react-three/drei

Animation
GSAP
Framer Motion

Styling
Tailwind CSS

Assets
GLTF / GLB

State
central application state store

Data
versioned JSON initially
future API/database compatible
```

## 19.2 Responsibility boundaries

### R3F / Three.js

Own:

```text
scene
camera
lighting
meshes
traces
3D interaction
rendering
```

### React

Own:

```text
application state
selection
search
filters
comparison
panels
navigation state
```

### GSAP

Prefer for:

```text
camera choreography
complex 3D transitions
cinematic sequences
```

### Framer Motion

Prefer for:

```text
HTML overlays
panels
menus
micro-interactions
```

Do not let multiple animation systems simultaneously control the same property.

---

# 20. Application State Machine

Recommended states:

```text
EXPLORE
   ↓
HOVER
   ↓
FOCUS
   ↓
INSPECT
   ↓
EXPLODED
   ↓
COMPARE
   ↓
RETURN
```

Additional global modes:

```text
SEARCH
FILTERED
LOADING
ERROR
```

The state system should be explicit rather than relying on scattered booleans such as:

```text
isOpen
isSelected
isAnimating
isComparing
isSearching
```

Use a coherent interaction model.

---

# 21. Component Architecture

Suggested React structure:

```text
app/
  page.tsx

components/
  world/
    SiliconEpochScene.tsx
    Motherboard.tsx
    Timeline.tsx
    EpochZone.tsx
    EntityNode.tsx
    ModelChip.tsx
    RelationshipTrace.tsx
    SceneLighting.tsx

  camera/
    CameraController.tsx
    CameraPath.tsx

  interaction/
    SelectionManager.tsx
    HoverManager.tsx
    NavigationController.tsx

  entity/
    EntityInspector.tsx
    ExplodedView.tsx
    EntityHeader.tsx
    SpecLayer.tsx
    ArchitectureLayer.tsx
    InfrastructureLayer.tsx
    EvidenceLayer.tsx

  compare/
    CompareDock.tsx
    CompareScene.tsx
    CompareMetrics.tsx

  discovery/
    Search.tsx
    FilterPanel.tsx
    SearchResults.tsx

  ui/
    CommandPalette.tsx
    TimelineLabels.tsx
    LoadingScreen.tsx
```

The exact names can change; the separation of concerns should not.

---

# 22. Data-to-Scene Pipeline

The application should transform data into a scene through a deterministic pipeline:

```text
RAW DATA
   ↓
VALIDATION
   ↓
NORMALIZATION
   ↓
RELATIONSHIP GRAPH
   ↓
TEMPORAL POSITIONING
   ↓
VISUAL MAPPING
   ↓
SCENE GRAPH
   ↓
R3F RENDER
```

Never place business logic directly inside the rendering component.

Bad:

```tsx
<Chip size={model.parameters * 0.1} />
```

Prefer:

```text
model
 ↓
visualMappingService
 ↓
normalizedVisualProperties
 ↓
Chip
```

---

# 23. Spatial Positioning

## 23.1 Primary axis

Time should determine the primary coordinate.

Conceptually:

```text
x = normalized_date
```

But the exact position should also account for:

```text
epoch
collision avoidance
importance
relationship routing
visual composition
```

## 23.2 Secondary axis

Secondary dimensions may encode category:

```text
research
models
hardware
products
```

The mapping should remain stable.

## 23.3 Collision handling

Automatic layout must avoid:

- overlapping labels
- chip collisions
- trace tangles
- inaccessible objects
- unreadable clusters

Use deterministic layout so the same dataset produces predictable results.

---

# 24. Era Storytelling

The experience should have narrative transitions.

Example:

```text
FOUNDATIONS

Turing
Perceptron
Early neural networks
Symbolic reasoning

↓

THE CONNECTIONIST REVIVAL

Backpropagation
CNNs
RNNs

↓

THE DEEP LEARNING BOOM

AlexNet
Transformers approaching relevance
Large-scale GPU training

↓

THE TRANSFORMER ERA

Attention Is All You Need
BERT
GPT
T5

↓

FOUNDATION MODELS

Large multimodal systems
Instruction tuning
RLHF
Diffusion

↓

THE CURRENT FRONTIER

Reasoning
Agents
Multimodality
Long context
Tool use
```

These narratives should be driven by actual entities and relationships, not hardcoded into the renderer.

---

# 25. Accessibility

The 3D experience must have a non-3D information path.

Minimum requirements:

```text
keyboard navigation
focus states
reduced-motion support
screen-reader-compatible entity information
text-based search
accessible comparison data
```

For users who disable motion:

```text
camera animation → instant transition
exploded animation → static layered view
parallax → disabled
```

---

# 26. Error & Unknown-State Design

The UI must distinguish between:

```text
Known value
Estimated value
Derived value
Not disclosed
Not applicable
Unknown
Conflicting sources
```

Never silently transform:

```text
null → 0
unknown → false
undisclosed → estimated
```

This is especially important for:

```text
parameter counts
training compute
benchmark performance
architecture details
```

---

# 27. Asset Strategy

The first version should avoid depending on hundreds of bespoke 3D assets.

Use a modular primitive library:

```text
chip base
chip lid
pins
ports
heat spreader
GPU die
memory banks
PCB module
server assembly
rack assembly
connector
via
trace
```

Then compose them.

## Asset priorities

### Tier 1
Highly visible selected entity.

### Tier 2
Nearby entities.

### Tier 3
Background entities.

### Tier 4
Distant proxies.

Use GLTF/GLB for reusable assets.

---

# 28. Design System

## Typography

Use restrained technical typography.

Hierarchy:

```text
Epoch title
Entity title
Section title
Metric
Metadata
Source
```

Do not overuse all-caps.

## Materials

Preferred palette direction:

```text
matte black
graphite
dark glass
machined metal
subtle copper
cool cyan
controlled amber
```

Avoid making every element glow.

## Glow

Glow means:

```text
activity
selection
importance
energy
connection
```

It should not mean:

```text
everything
```

---

# 29. Audio Considerations

Optional future feature.

Possible subtle sound design:

```text
chip selection click
trace activation
camera travel ambience
mechanical separation
successful comparison
```

Audio must be disabled by default unless explicitly enabled.

No distracting sci-fi soundtrack is required for the core experience.

---

# 30. Analytics / Instrumentation

Product analytics should measure interaction quality, not merely page views.

Potential events:

```text
epoch_entered
entity_hovered
entity_selected
entity_inspected
lineage_explored
search_used
filter_used
comparison_started
comparison_completed
deep_link_opened
```

Do not log unnecessary sensitive user information.

---

# 31. URL / Navigation Model

Recommended routes:

```text
/
 /epoch/:epoch
 /entity/:entityId
 /compare/:entityA/:entityB
 /search?q=...
```

The exact routing implementation can change, but entity views should be addressable and shareable.

---

# 32. Initial Data Scope

Do not attempt to represent all AI history in the first build.

Start with a curated set that demonstrates:

```text
historical foundations
major neural-network milestones
deep learning
Transformer
major foundation models
important hardware transitions
selected modern models
```

Quality and relationship accuracy matter more than quantity.

---

# 33. MVP Definition

The MVP is successful when a new user can:

1. Enter the world.
2. Understand that the board represents AI evolution.
3. Travel through time.
4. Identify major entities.
5. Select an entity.
6. Inspect it through an exploded view.
7. Follow its relationships.
8. Search for an entity.
9. Compare two entities.
10. open source evidence.

The MVP does **not** need:

```text
thousands of entities
perfect mobile parity
fully automated data ingestion
complex multiplayer
procedural asset generation
AI-generated explanations everywhere
```

---

# 34. Phased Implementation Plan for the Coding Agent

## Phase 0 — Contracts Before Code

Before implementing visuals:

1. Define entity types.
2. Define relationship types.
3. Define canonical JSON schema.
4. Define application state machine.
5. Define visual grammar.
6. Define coordinate system.
7. Define camera states.
8. Define performance budgets.
9. Define responsive behavior.
10. Define source/provenance structure.

Deliverable:

```text
validated sample dataset
+
type definitions
+
state model
+
visual mapping utilities
```

Do not start by hardcoding visual positions.

---

## Phase 1 — 3D Foundation

1. Initialize Next.js application.
2. Configure R3F.
3. Create the motherboard.
4. Create timeline trace.
5. Establish camera system.
6. Establish lighting.
7. Establish basic materials.
8. Add epoch markers.
9. Implement responsive canvas sizing.

Deliverable:

```text
navigable empty motherboard world
```

---

## Phase 2 — Data & Scene Graph

1. Load normalized JSON.
2. Validate data.
3. Build entity graph.
4. Calculate timeline positions.
5. Calculate visual scale.
6. Render entity nodes.
7. Render relationship traces.
8. Implement visibility/culling.

Deliverable:

```text
real data-driven AI timeline
```

---

## Phase 3 — Navigation

1. Implement Glide.
2. Implement camera spline/path.
3. Add damping.
4. Add keyboard navigation.
5. Add focus transitions.
6. Add epoch snapping.
7. Add orientation cues.

Deliverable:

```text
smooth time-travel navigation
```

---

## Phase 4 — Entity Inspection

1. Add hover states.
2. Add selection.
3. Implement camera focus.
4. Implement exploded chip.
5. Build HTML overlays.
6. Add spec layers.
7. Add relationship panel.
8. Add evidence panel.

Deliverable:

```text
full Exploded CAD Teardown
```

---

## Phase 5 — Search & Filters

1. Build search index.
2. Add command palette.
3. Add search results.
4. Add entity targeting.
5. Add filter system.
6. Implement world-level highlighting.
7. Support deep links.

Deliverable:

```text
discoverable knowledge system
```

---

## Phase 6 — Versus Mode

1. Add compare dock.
2. Add entity pairing.
3. Add camera re-composition.
4. Build normalized comparison metrics.
5. Add visual comparisons.
6. Handle missing metrics correctly.

Deliverable:

```text
interactive comparison experience
```

---

## Phase 7 — Performance Pass

1. Profile GPU usage.
2. Implement instancing.
3. Implement LOD.
4. Implement relationship culling.
5. Optimize shadows.
6. Optimize post-processing.
7. Optimize asset loading.
8. Test low-end hardware.

Deliverable:

```text
stable performance under realistic dataset sizes
```

---

## Phase 8 — Mobile / Accessibility

1. Add reduced-motion mode.
2. Add keyboard support.
3. Add screen-reader information path.
4. Implement mobile timeline.
5. Simplify mobile 3D.
6. Test touch navigation.

Deliverable:

```text
accessible responsive experience
```

---

## Phase 9 — Polish

Only after functionality and performance are stable:

1. Improve materials.
2. Improve lighting.
3. Add refined chip details.
4. Add restrained bloom.
5. Add micro-interactions.
6. Improve transition choreography.
7. Add subtle sound.
8. Refine typography.
9. Tune pacing.

The polish phase must not become an excuse to postpone architecture or performance work.

---

# 35. Coding Agent Rules

The coding agent must follow these rules.

## DO

```text
DO use the data schema as the source of truth.

DO separate data, layout, state, and rendering.

DO build reusable primitives.

DO use typed relationships.

DO preserve unknown values.

DO implement progressive loading.

DO use LOD and instancing.

DO keep 3D and 2D responsibilities separate.

DO keep camera transitions deterministic.

DO make entities deep-linkable.

DO design for future API/database replacement.

DO optimize after proving the interaction model.
```

## DO NOT

```text
DO NOT hardcode model data into 3D components.

DO NOT invent technical specifications.

DO NOT use raw parameter count as the only visual size metric.

DO NOT render every graph edge at maximum quality.

DO NOT make everything glow.

DO NOT make every element interactive.

DO NOT use 3D for dense data tables.

DO NOT force desktop 3D onto mobile.

DO NOT introduce arbitrary decorative geometry without semantic purpose.

DO NOT add heavy post-processing before profiling.

DO NOT couple camera logic to individual UI components.

DO NOT treat "unknown" as zero.

DO NOT create a fake lineage merely because two models seem related.
```

---

# 36. Quality Gates

Each phase must satisfy a quality gate before the next phase begins.

## Data gate

```text
Schema validated
Relationships typed
No fabricated values
Sources attached where available
```

## Visual gate

```text
Timeline understandable
Entity types distinguishable
Selected object obvious
Visual hierarchy clear
```

## Interaction gate

```text
No lost state
Camera transitions predictable
Search targeting reliable
Back/return behavior reliable
```

## Performance gate

```text
No major frame-rate collapse
No uncontrolled memory growth
Large graph remains navigable
```

## Accessibility gate

```text
Keyboard path works
Reduced motion works
Information remains available outside the canvas
```

---

# 37. Future Architecture

The initial version can use static JSON.

The architecture should remain compatible with:

```text
JSON
  ↓
API
  ↓
database
  ↓
knowledge graph / graph database
  ↓
automated data ingestion
```

Future services may include:

```text
data ingestion
source verification
benchmark normalization
price history
model metadata updates
graph computation
search indexing
```

The frontend should not need a major rewrite when the data source changes.

---

# 38. Future Advanced Features

Potential V3+ features:

## 38.1 AI-guided exploration

Ask:

```text
"How did Transformers lead to GPT?"
```

The system highlights the relevant path.

## 38.2 Dynamic storytelling

Generate guided tours:

```text
30 years of neural networks
The path to modern LLMs
How GPUs changed AI
The evolution of multimodality
```

## 38.3 Time-lapse mode

Automatically travel through the timeline while significant nodes activate.

## 38.4 Alternative history

Explore:

```text
"What if the Transformer had never become dominant?"
```

This must clearly distinguish hypothetical content from factual history.

## 38.5 Personal exploration

Users could bookmark:

```text
entities
paths
epochs
comparisons
```

---

# 39. Core Product Metrics

The product should optimize for:

```text
time spent exploring
entities inspected per session
lineage paths explored
search-to-inspection completion
comparison usage
return visits
deep-link sharing
```

Do not optimize exclusively for raw session length.

The ideal outcome is:

> The user discovers one thing, becomes curious about its ancestor, follows the trace, discovers another breakthrough, and continues exploring naturally.

That exploration loop is the heart of Silicon Epoch.

---

# 40. Final Product Definition

Silicon Epoch should ultimately feel like:

```text
               A MUSEUM
                  +
          A KNOWLEDGE GRAPH
                  +
          A SCIENTIFIC VISUALIZATION
                  +
             A GAME MAP
                  +
          A HARDWARE LAB
```

The motherboard is the canvas.

The timeline is the spine.

The chips are the entities.

The traces are the relationships.

The exploded view is the explanation.

The evidence layer is the trust mechanism.

The search system is the navigation mechanism.

The comparison system is the analytical mechanism.

Together they create an experience where the user does not simply read AI history.

They **navigate it**.

---

# 41. Agent Handoff Summary

Build the product in this order:

```text
1. DATA CONTRACT
2. GRAPH MODEL
3. VISUAL GRAMMAR
4. MOTHERBOARD
5. TIMELINE
6. ENTITY NODES
7. RELATIONSHIP TRACES
8. CAMERA / GLIDE
9. ENTITY INSPECTION
10. SEARCH
11. FILTERS
12. COMPARE
13. EVIDENCE
14. PERFORMANCE
15. RESPONSIVE / ACCESSIBILITY
16. VISUAL POLISH
```

The agent should resist the temptation to build a visually impressive demo with weak underlying architecture.

The goal is not:

> "Make a cool 3D AI website."

The goal is:

> **Build a visually extraordinary, data-driven, explorable knowledge system that makes the evolution of AI understandable through space, time, scale, and relationships.**
