<h2>Architecture Decision Records (ADR)</h2>

<p>
This document summarizes the key technology decisions for Buckeye Marketplace and explains why each choice supports the user needs identified in Milestone 1. It also documents how AI was used during the decision-making process, as required in Milestone 2.
</p>

<br>

<h3>Decision 1: React for the Frontend</h3>
<p><strong>Why:</strong> React enables fast, responsive user interfaces that support quick searching, filtering, and browsing of listings. This directly addresses Alex’s need to find specific items efficiently without wasting time on cluttered or slow platforms. React’s component-based structure also supports building clear, reusable listing views that help Maya quickly understand item details and trust what she is seeing.</p>
<p><strong>AI Usage:</strong> AI was used to help break down the Product Catalog feature into reusable UI components and to validate how search and filter interactions could be structured to remain responsive as listings grow.</p>

<br>

<h3>Decision 2: .NET Web API for the Backend</h3>
<p><strong>Why:</strong> .NET provides a structured and reliable API layer for handling product data, user accounts, and messaging between buyers and sellers. This supports Jordan’s need for clear, dependable communication and reduces frustration caused by slow or inconsistent responses when coordinating meetups.</p>
<p><strong>AI Usage:</strong> AI was used to outline a minimal set of REST API endpoints needed to support product browsing and buyer–seller messaging, which were then compared against the API-first patterns discussed in lecture.</p>

<br>

<h3>Decision 3: SQL Database</h3>
<p><strong>Why:</strong> A relational SQL database is well suited for storing structured data such as users, products, categories, messages, and meetup details. This supports Maya’s need for trustworthy listings with clear descriptions, consistent seller information, and reliable message history.</p>
<p><strong>AI Usage:</strong> AI was used to review the high-level ERD and confirm that the main entities and relationships support the prioritized user stories without adding unnecessary complexity.</p>

<br>

<h3>Decision 4: GitHub for Project Management</h3>
<p><strong>Why:</strong> GitHub Projects provides a Kanban-style workflow for organizing and prioritizing features, which supports the course requirement and helps ensure that high-impact features like Product Catalog and Messaging are addressed first.</p>
<p><strong>AI Usage:</strong> AI was used to help translate journey map pain points into Must-Have and Should-Have features when organizing the GitHub Project board.</p>
