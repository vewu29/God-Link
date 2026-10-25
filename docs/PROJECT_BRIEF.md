# Project Brief: Free, Open Learning Platform

## Instructions and Context for Claude Opus

**Project status:** Existing, content-rich web application
**Original creator:** Independent developer using AI-assisted development
**Current starting point:** Muse AI-generated HTML application
**Development environment:** Claude Code Cloud connected to GitHub
**Mission:** Build a professional, high-quality, free educational platform supported by voluntary donations.

---

# 1. The Vision

This project is an interactive educational web application designed to make learning accessible to everyone, regardless of financial circumstances.

It combines programming education, structured repetition drills, detailed reference material, complete-program exercises, and driving-permit study into a unified learning platform.

The creator wants to turn the existing application into a professional, comprehensive, maintainable product that can grow through community contributions.

The intended model is:

* Free access to the core learning experience.
* Voluntary donations to fund continued development and operating costs.
* Open-source software and reusable educational content under appropriate licenses.
* A community-friendly structure that permits contributions and independent hosting.
* High-quality educational material that is organized, tested, and maintainable.
* A professional user experience on mobile and desktop.

The ultimate goal is to make the platform useful to anyone who wants to learn, without requiring them to purchase a course or subscription.

**Do not turn the project into a paywalled educational service.** Donations are intended to support the platform, not determine who can access its educational resources.

---

# 2. Current Project and Development History

The application was initially created using Meta Muse AI.

The creator downloaded the generated application as a single HTML file and connected it to a GitHub repository. Claude Code Cloud is connected to that repository and will be used to continue development.

The creator reports that the complete framework is already laid out and that the application includes all of its major learning areas and systems.

The creator also used an iterative model-chaining technique with Muse AI. The application went through **77 loops**, with each loop intended to identify bugs and upgrade the user interface.

This means the current application is not intended to be a blank-page project. It already has a substantial foundation and a defined product vision.

The creator reports that the application is working. Nevertheless, independently inspect and verify its functionality rather than assuming every feature is bug-free.

The original design was inspired by the structure of two books. The application should develop its own identity, content, explanations, and examples. Respect applicable copyright and licensing requirements when working with external educational sources.

## Most important instruction

**Do not discard the existing application and rebuild it from scratch simply because you can design a different architecture.**

First understand the actual implementation, identify its strengths and weaknesses, and determine which improvements will provide the greatest value.

Preserve the original functionality and design intent unless there is a clear, justified reason to change them.

---

# 3. Existing Learning Areas

The creator reports that the application already contains the following systems.

## 3.1 C++ learning

An interactive learning environment for C++ that includes syntax practice, explanations, reference material, and exercises involving complete programs.

Potential areas for future expansion include:

* Variables and data types.
* Operators and expressions.
* Conditions and branching.
* Loops and iteration.
* Functions and parameters.
* Arrays, strings, and collections.
* Pointers and references.
* Classes, objects, and object-oriented programming.
* Memory management and resource handling.
* Templates and generic programming.
* Standard library facilities.
* File handling.
* Error handling.
* Algorithms and data structures.
* Debugging and program design.
* Larger projects that combine multiple concepts.

These are potential content categories, not a claim that any particular category is currently missing. Audit the existing material before adding duplicates.

## 3.2 C# learning

A corresponding interactive learning environment for C#.

Potential content areas include:

* Variables and types.
* Expressions and operators.
* Conditions and loops.
* Methods and parameters.
* Arrays and collections.
* Classes, structs, and interfaces.
* Object-oriented design.
* Properties and events.
* Exceptions.
* LINQ.
* Generics.
* Asynchronous programming.
* File and data handling.
* Application architecture.
* Debugging and testing.
* Complete application exercises.

Again, inspect the current library before deciding what needs expansion.

The C++ and C# tracks should share reusable learning infrastructure wherever practical while preserving language-specific behavior and explanations.

## 3.3 Repetition-based syntax drills

The platform includes a distinctive drill system in which learners repeatedly type a particular syntax pattern.

One described workflow requires the learner to type a syntax item **eight times before moving to the next item**.

This repetition model is an intentional part of the educational experience.

Preserve it.

Possible improvements include:

* Accurate repetition counters.
* Clear visual feedback.
* Immediate identification of incorrect input.
* Helpful hints and explanations.
* Progress indicators.
* Keyboard-friendly input.
* Mobile-friendly typing.
* Review of difficult items.
* Optional spaced repetition.
* Tracking of common mistakes.

Do not silently remove or alter the eight-repetition behavior. If a configurable repetition count would be useful, retain eight as the default.

Avoid making the learner repeat an item unnecessarily because of harmless formatting differences when those differences do not affect the concept being taught. However, syntax drills must still enforce the rules that matter for the particular exercise.

## 3.4 Detailed learning library

The platform contains a library that explains concepts in detail.

This is a central component of the application. It should serve as a meaningful reference resource rather than a collection of superficial definitions.

Potential improvements include:

* Searchable explanations.
* Topic categories and tags.
* Difficulty levels.
* Prerequisite relationships.
* Code examples.
* Explanations of why syntax works.
* Common errors and misconceptions.
* Cross-links to relevant drills.
* Cross-links to complete-program exercises.
* Related concepts.
* Consistent formatting and navigation.

The library should help learners move from understanding a concept to practicing it and eventually applying it.

Preserve useful existing explanations and organization.

## 3.5 Complete-program exercises and compilation

The application includes complete-program exercises. Learners type programs and use a **Compile** control.

This is an important distinction from a basic tutorial website: learners are intended to write actual programs, not merely read about programming.

Audit the current compilation implementation carefully.

Determine:

* Whether compilation currently invokes a real compiler or is simulated.
* Which programming languages are supported.
* Which compiler versions and runtimes are available.
* How syntax errors and compiler diagnostics are presented.
* Whether program output is captured correctly.
* How invalid or incomplete programs are handled.
* Whether execution limits are enforced.
* Whether the interface works well on mobile devices.

If real compilation already works, preserve and test it.

If compilation is incomplete or simulated, explain the gap before replacing it with a real implementation.

For any real compiler integration, use a secure, isolated execution environment. Never execute arbitrary user-submitted code directly on an unprotected production server.

Apply appropriate time, memory, process, filesystem, network, and output restrictions. Ensure that one learner's program cannot compromise other users or the hosting infrastructure.

## 3.6 Driving-permit study

The application also contains a driving-permit learning and study area.

Treat this as a distinct educational track that can reuse the platform's general learning infrastructure where appropriate.

Potential content includes:

* Road signs.
* Rules of the road.
* Right-of-way scenarios.
* Traffic signals and markings.
* Safe driving practices.
* Practice questions.
* Explanations of incorrect answers.
* Topic-based quizzes.
* Review drills.
* Practice examinations.

First determine the jurisdiction the current application targets. Driving laws and permit requirements differ between states and can change over time.

Prefer current official driver handbooks and other reliable, authorized sources. Keep explanations accurate, identify the applicable jurisdiction, and review time-sensitive material periodically.

Do not represent practice questions as official examination questions unless their status and reuse are authorized.

---

# 4. Content Expansion

The creator wants to expand an already content-rich application with potentially hundreds of additional educational items.

The goal is not simply to increase the page count. The goal is to build a deeper, more useful learning resource.

Possible additions include:

* Syntax drills.
* Detailed concept explanations.
* Worked examples.
* Complete-program challenges.
* Debugging exercises.
* Knowledge checks.
* Topic-based quizzes.
* Advanced programming challenges.
* Reference entries.
* Common-mistake guides.
* Review exercises.
* Permit-study questions.
* Road-sign learning material.
* Cross-linked learning paths.

## Content creation requirements

Generate and validate new material in manageable batches.

For each item, where appropriate:

1. Assign a stable identifier.
2. Identify its subject and topic.
3. Specify a difficulty level.
4. Define learning objectives.
5. Identify prerequisites.
6. Check technical accuracy.
7. Validate code examples using the appropriate compiler or runtime when available.
8. Check that explanations, expected answers, and test cases agree.
9. Avoid unintended duplication.
10. Connect the item to relevant library entries and exercises.
11. Record source and licensing information when external materials inform the content.

Do not populate the application with hundreds of unverified AI-generated pages.

For programming material, automated tests should verify that examples compile or run where practical.

For permit-study material, verify answers against appropriate official or otherwise reliable sources.

## Scalable content architecture

Inspect whether the existing application already has a reusable content model.

If the application contains extensive hard-coded content, evaluate whether structured data and reusable templates could make future expansion easier.

Possible formats include JSON, Markdown, or another appropriate format, depending on the existing architecture.

Do not refactor merely for the sake of refactoring. The proposed content system must preserve the existing user experience and make it easier to add, review, and maintain educational material.

---

# 5. The Learning Experience

The platform should connect learning, repetition, reference, and application into a coherent experience.

For example, a learner studying C++ variables might:

1. Read a detailed explanation of variables and data types.
2. Review working code examples.
3. Complete the existing syntax-repetition drill.
4. Move to an exercise that uses variables in a complete program.
5. Compile and run the program.
6. Review compiler errors or incorrect results.
7. Revisit the explanation if needed.
8. Continue to the next concept.

This illustrates the intended relationship between existing systems. It is not a requirement to force every topic into an identical sequence.

Evaluate how the current application already connects these areas before changing its navigation or learning flow.

Potential improvements include progress tracking, weak-topic review, optional spaced repetition, prerequisites, and more useful feedback.

Prioritize features that measurably help learners understand concepts and correct mistakes.

---

# 6. Professional UI and UX

The creator wants the existing application refined into a professional, high-quality website.

The creator has already run 77 Muse AI improvement loops focused on bug detection and UI upgrades. Treat that work as a head start while independently checking the results.

Focus on genuine improvements, including:

* Consistent typography.
* Clear visual hierarchy.
* Appropriate spacing.
* Consistent colors and component styling.
* Responsive navigation.
* Readable code examples.
* Well-designed drill interfaces.
* Clear compile and output panels.
* Helpful loading and error states.
* Accessible controls.
* Keyboard navigation.
* Screen-reader compatibility.
* Sufficient color contrast.
* Mobile-friendly layouts.
* Performance and loading improvements.
* Consistent interaction behavior.

The platform must work well on both phones and desktops.

Because the creator currently manages development from an iPhone, mobile usability is particularly important.

Test representative small-screen and desktop layouts. Do not assume that a design which looks good on a desktop will work on a phone.

Preserve the application's useful visual identity. Improve it systematically rather than replacing it with a generic template.

---

# 7. Free, Open, Community-Supported Model

The intended funding model is voluntary donations.

Core educational content should remain free to access.

Donations may help fund:

* Hosting.
* Secure compiler infrastructure.
* Database services, if needed.
* Maintenance.
* Security updates.
* Content development.
* Accessibility improvements.
* Community infrastructure.

The platform should remain useful even when donations are low.

## Community development

Evaluate practical ways to enable community participation:

* Public issue reporting.
* Contribution guidelines.
* Review of proposed code changes.
* Educational-content contribution workflows.
* Documentation.
* Clear project goals.
* Transparent maintenance practices.
* Self-hosting instructions.
* Exportable learner data where applicable.

## Decentralization goals

The creator wants the platform to be open and not dependent on a single organization controlling access to education.

Explore ways to support:

* Self-hosting.
* Portable educational content.
* Portable learner data.
* Community contributions.
* Publicly documented interfaces.
* Reduced dependence on proprietary services.

Do not introduce complicated distributed infrastructure merely to label the platform decentralized. Prefer practical, maintainable steps that improve independence and resilience.

## Licensing

Recommend appropriate licenses for the software and educational content, explaining the trade-offs.

Software code and educational content may require different licenses.

Verify that the project has the right to distribute all included text, images, icons, fonts, libraries, and other third-party assets.

Do not assume that generated content is automatically accurate, original, or free from licensing concerns.

---

# 8. Backend and Hosting

The application currently starts as a single HTML file. Inspect its actual dependencies and behavior before proposing a new architecture.

A single HTML file can contain substantial CSS and JavaScript and can already provide complex interactive behavior. A larger folder structure is not inherently better unless it improves maintainability or functionality.

Potential future capabilities include:

* Persistent learner progress.
* Optional user accounts.
* Synchronization across devices.
* A database.
* Server-side processing.
* Secure compiler integration.
* Donation processing.
* Administrative content tools.

These are potential improvements, not assumptions that the current application lacks them.

Determine which features already work and which genuinely need server-side support.

## Static hosting

GitHub Pages can host a static frontend using HTML, CSS, JavaScript, and static assets.

However, GitHub Pages does not run a custom Python, PHP, or Node.js backend.

If the application requires backend functionality, evaluate a suitable separate service and explain its cost, free-tier limits, security requirements, and maintenance burden.

Keep secrets, private API keys, and database credentials out of frontend code.

## Cost-conscious design

The platform is intended to remain free for learners, so recurring operating costs matter.

Prefer inexpensive infrastructure where practical.

Keep static educational content separate from services that incur variable costs, such as compiler execution or hosted AI features.

Do not make an expensive service essential to every basic learning interaction unless there is a clear, sustainable plan.

---

# 9. Current Development Workflow

The creator has a Claude Pro account and uses Claude Code Cloud connected to the GitHub repository containing the Muse AI HTML file.

The creator currently works from an iPhone and wants to direct development through this remote workflow.

The intended process is:

1. Inspect the repository.
2. Understand the existing code.
3. Establish a recoverable baseline.
4. Plan improvements.
5. Implement changes in manageable increments.
6. Run available tests.
7. Review the changes.
8. Commit and push changes when supported and authorized.
9. Verify the repository reflects the intended changes.
10. Deploy through suitable hosting when ready.

A GitHub connection does not automatically guarantee that all edits have been committed, pushed, or published. Verify the actual workflow and repository status.

Before significant refactoring, preserve the original application and ensure that a previous working version can be recovered.

Use descriptive commit messages and avoid combining unrelated changes into one large, difficult-to-review change.

---

# 10. Instructions for Claude Opus

## Phase 1: Inspect before editing

Start by inspecting the complete repository and the existing application.

Determine:

* The current file structure.
* The application's navigation.
* Existing learning areas.
* Existing drills and repetition logic.
* The reference library and its content.
* Complete-program exercises.
* Actual compilation behavior.
* Driving-permit study functionality.
* Existing state management and data persistence.
* External dependencies.
* Mobile and desktop behavior.
* Current bugs and likely weaknesses.
* Security and licensing concerns.
* Existing tests and opportunities for automated testing.

Distinguish between confirmed issues, potential issues, and features that already work.

Do not claim to have tested something unless you actually ran the relevant test or verified the behavior.

**Do not rewrite the application during the initial audit.**

## Phase 2: Produce a grounded development plan

After the audit, prepare a prioritized plan covering:

1. Critical bugs and security concerns.
2. Protection of existing functionality.
3. Automated regression tests.
4. UI and accessibility improvements.
5. Content expansion.
6. Content validation.
7. Compiler reliability and safety.
8. Backend requirements, if any.
9. Deployment and operating costs.
10. Donation and community infrastructure.
11. Documentation and licensing.

Explain why each major change is useful.

Separate essential fixes from optional improvements.

Do not assume that every potential feature listed in this brief needs to be added. First compare it with what is already implemented.

## Phase 3: Implement incrementally

Once the plan is approved:

1. Preserve the original version.
2. Establish a recoverable baseline.
3. Add tests where practical.
4. Fix confirmed bugs.
5. Verify the fixes.
6. Improve the UI without unnecessarily changing the existing learning workflow.
7. Refactor in small, reversible steps.
8. Preserve existing features.
9. Add educational content in validated batches.
10. Run relevant tests after major changes.
11. Document significant architectural decisions.
12. Commit and push changes when supported and authorized.

Do not make sweeping architectural changes simply because a different framework or technology seems fashionable.

## Phase 4: Report verified results

For each major development batch, report:

* What changed.
* Which files were affected.
* Which features were added or improved.
* Which tests actually ran.
* Test results.
* Known limitations.
* Unverified behavior.
* Whether changes were committed and pushed.
* Any deployment steps still required.

Never claim that a feature works, a program compiled, a test passed, or a deployment succeeded unless the result was actually verified.

---

# 11. Definition of Success

The project is progressing toward its goal when it has:

* A professional, responsive interface.
* The existing learning framework and functionality preserved.
* Extensive, organized, accurate educational content.
* Effective C++ and C# learning tracks.
* Reliable repetition drills.
* A detailed, searchable learning library.
* Complete-program exercises with secure compilation where supported.
* Useful driving-permit study material appropriate to the intended jurisdiction.
* Automated tests protecting existing features.
* Clear documentation and maintainable architecture.
* Appropriate software and content licensing.
* A voluntary donation model that supports free access.
* Community contribution and self-hosting options.
* Sustainable operating costs.
* A development process that can be managed remotely.

# Final Direction

This is an existing product with a substantial head start, not a blank-page project.

The creator has already established the framework, learning areas, and major interactive systems using Muse AI, followed by 77 iterative bug-finding and UI-improvement loops.

Your job is to understand the actual implementation, verify its strengths, identify what still needs work, and improve it systematically.

**Preserve what works. Fix what is broken. Expand what is valuable. Validate new content. Improve the architecture only where justified. Keep the educational experience free.**

The objective is a reliable, professional, community-supported learning platform that can grow substantially without losing the functionality and vision already established.
