<h2>Architecture Decision Records (ADR)</h2>

<p>
This document summarizes the key technology decisions for Buckeye Marketplace and explains why each choice supports the user needs identified in Milestone 1. It also documents how AI was used during the decision-making process, as required in Milestone 2.
</p>

<br>

<h3>Decision 1: React for the Frontend</h3>
<p><strong>Why:</strong> React supports fast, responsive UI updates, which directly helps Alex quickly search, filter, and browse listings without delays. Its component-based structure also aligns with the Atomic Design approach required for the Product Catalog.</p>
<p><strong>AI Usage:</strong> AI was used to clarify how React’s component model supports reusable UI pieces and fast filtering behavior.</p>

<br>

<h3>Decision 2: .NET Web API for the Backend</h3>
<p><strong>Why:</strong> .NET provides a structured, reliable API layer that supports messaging, product retrieval, and user authentication. This stability directly supports Jordan’s need for dependable communication and seller response status.</p>
<p><strong>AI Usage:</strong> AI was used to confirm that .NET integrates cleanly with SQL and supports the REST endpoints needed for the MVP.</p>

<br>

<h3>Decision 3: SQL Database</h3>
<p><strong>Why:</strong> A relational database is the best fit for structured entities like Users, Products, Categories, Threads, and Messages. Maya’s need for trustworthy, accurate listing information is supported by SQL’s consistency and relationships.</p>
<p><strong>AI Usage:</strong> AI helped validate that the ERD structure aligns with relational modeling and supports the user stories.</p>

<br>

<h3>Decision 4: GitHub for Project Management</h3>
<p><strong>Why:</strong> GitHub Projects provides a Kanban board for prioritizing features and tracking progress, which is required for Milestone 2.</p>
<p><strong>AI Usage:</strong> AI was used to clarify how to structure the Kanban board and categorize Must-Have features.</p>
