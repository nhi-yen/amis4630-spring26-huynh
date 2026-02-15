<h2>Database Schema Design (ERD)</h2>

<p>
This conceptual Entity Relationship Diagram (ERD) represents the main data entities and relationships required to support the Must-Have features for Buckeye Marketplace. The schema focuses on the big-picture structure needed for listing creation, product browsing, filtering, user accounts, messaging, seller responsiveness, and safe meetup coordination. No attributes, data types, or constraints are included, as required for Milestone 2.
</p>

<br><br>

<h3>Entity Relationship Diagram</h3>

<br>

<img width="541" height="361" alt="database-schema-design drawio" src="https://github.com/user-attachments/assets/8950e91e-dc2f-4332-a15f-b603f1fe4702" />

<br><br>

<h3>Entities and Their Roles</h3>

<h4>Users</h4>
<p>Supports registration, login, user profiles, seller identity, buyer identity, and seller response status.</p>

<h4>Products</h4>
<p>Supports the product catalog, listing cards, required listing fields, and filtering by condition, price, and category.</p>

<h4>Categories</h4>
<p>Supports student-focused item categories and enables category-based filtering.</p>

<h4>Threads</h4>
<p>Represents a conversation between a buyer and seller about a specific product. Supports in-app messaging and seller response status.</p>

<h4>Messages</h4>
<p>Stores individual messages within a thread, enabling simple chat between buyer and seller.</p>

<h4>MeetupDetails</h4>
<p>Stores proposed pickup times and safe meetup locations associated with a specific thread.</p>

<br><br>

<h3>Relationship Mappings</h3>

<p>Users 1 &mdash; N Products</p>
<p>Categories 1 &mdash; N Products</p>

<p>Users 1 &mdash; N Threads (as buyer)</p>
<p>Users 1 &mdash; N Threads (as seller)</p>

<p>Products 1 &mdash; N Threads</p>

<p>Threads 1 &mdash; N Messages</p>
<p>Threads 1 &mdash; N MeetupDetails</p>

<br><br>

<h3>How the Schema Supports User Stories</h3>

<p><strong>User Story #1 (Basic Search Bar):</strong> Products and Categories enable searching by name, category, and other listing fields.</p>
<p><strong>User Story #2 (Filters for Condition, Price, Category):</strong> Products store condition and price, while Categories support category filtering.</p>
<p><strong>User Story #3 (Listing Cards With Photos and Details):</strong> Products provide the required listing fields needed to display listing cards.</p>
<p><strong>User Story #4 (Required Listing Fields):</strong> Products represent all required listing information (title, description, condition, price, category).</p>
<p><strong>User Story #5 (In-App Messaging):</strong> Threads and Messages enable buyer–seller communication tied to a specific product.</p>

<br><br>

<h3>Connection to Milestone 1</h3>

<p>
This schema directly supports the needs identified in the personas and journey map. Maya’s need for trustworthy, clear listings is supported through Products and Categories. Alex’s need for fast, organized browsing is supported through Products, Categories, and filtering. Jordan’s frustration with unreliable communication is addressed through Threads and Messages, which structure buyer–seller interactions. Safety concerns from the journey map are supported through MeetupDetails, which store safe meetup locations and pickup times. Overall, the schema ensures that the technical design aligns with the user-centered insights from Milestone 1.
</p>
