# amis4630-spring26-huynh
AMIS 4630 Buckeye Marketplace Project

<h1>Buckeye Marketplace</h1>

<p>
Buckeye Marketplace is a student-focused peer-to-peer marketplace designed to help Ohio State students buy and sell pre-owned textbooks, dorm items, and class supplies safely and efficiently. The system is grounded in user research from Milestone 1, including personas and a journey map that identified pain points around cluttered browsing, unclear listings, unreliable seller communication, and safety concerns when meeting strangers.
</p>

<br>

<h2>Milestone 2 — Architecture Design & Frontend Foundation</h2>

<p>
This milestone focused on designing the system architecture, defining the component hierarchy using Atomic Design, and establishing the frontend foundation for Buckeye Marketplace. All design decisions were grounded in Milestone 1 research, including personas and journey map pain points.
</p>

<br>

<h3>Feature Prioritization</h3>

<p>
Features were prioritized using insights from the Milestone 1 journey map and personas, focusing on what is required to launch a usable MVP versus what can be deferred to later milestones.
</p>

<h4>Must-Have Features</h4>
<ul>
  <li>Product Catalog</li>
  <li>Student-Focused Item Categories</li>
  <li>Basic Search Bar</li>
  <li>Filters for Condition, Price, and Category</li>
  <li>Listing Cards with Photos and Details</li>
  <li>Required Listing Fields</li>
  <li>User Registration & Login</li>
  <li>User Profiles with Basic Info</li>
  <li>In-App Messaging (Simple Chat)</li>
  <li>Seller Response Status (Active/Inactive)</li>
  <li>Safe Meetup Location Suggestions</li>
  <li>Pickup Time Selector</li>
</ul>

<h4>Should-Have Features</h4>
<ul>
  <li>Report Listing Button</li>
  <li>Simple Notification Badge</li>
  <li>Item Availability Toggle</li>
  <li>Campus Map Link for Meetup Spots</li>
  <li>Basic Sorting Options</li>
  <li>Item Condition Labels</li>
  <li>Reviews & Ratings</li>
</ul>

<h4>Could-Have Features</h4>
<ul>
  <li>Shopping Cart</li>
  <li>Admin Dashboard</li>
  <li>Cloud Deployment</li>
  <li>Block User Option</li>
  <li>Item Tags</li>
</ul>

<br>

<h3>Architecture Decisions</h3>

<p>
Key technology decisions were documented using Architecture Decision Records (ADR) to explain how each choice supports user needs identified in Milestone 1.
</p>

<ul>
  <li>React was selected for the frontend to support fast, responsive browsing and reusable UI components.</li>
  <li>.NET Web API was selected for the backend to provide reliable product data access and buyer–seller messaging.</li>
  <li>SQL was selected for structured storage of users, products, messages, and meetup details.</li>
  <li>GitHub Projects was used for feature prioritization and Kanban-based workflow management.</li>
</ul>

<br>

<h3>Documentation</h3>

<p>
All design and architecture documentation for Milestone 2 is stored in the <code>/docs</code> folder:
</p>

<ul>
  <li>System Architecture Diagram</li>
  <li>Database Schema Design (ERD)</li>
  <li>Architecture Decision Records (ADR)</li>
  <li>Component Architecture (Atomic Design)</li>
</ul>

<br>

<h3>AI Tool Usage (Milestone 2)</h3>

<p>
AI tools were used as a research and clarification aid during Milestone 2 to validate architectural decisions, component structure, and database relationships. All final design decisions were reviewed and aligned with course lectures, personas, and journey map findings.
</p>


<br><br>

<h2>Milestone 3 — Product Catalog (Vertical Slice 1)</h2>

<p>
This milestone implements the first working feature of Buckeye Marketplace: a complete vertical slice of the Product Catalog. Users can view all products, click a product card, and see full product details. All data is fetched live from the .NET API using an in-memory product list.
</p>

<h3>How to Run the Project</h3>

<p><strong>Backend (.NET API)</strong></p>
<pre>
cd backend/BuckeyeMarketplaceApi
dotnet run
</pre>
<p>Runs at: <code>http://localhost:5000</code></p>

<p><strong>Frontend (React + Vite)</strong></p>
<pre>
cd frontend
npm install
npm run dev
</pre>
<p>Runs at: <code>http://localhost:5173</code></p>

<br>

<h3>Screenshots</h3>

<p><strong>Product List Page</strong></p>
<p>
  <img width="800" alt="Product List Screenshot"
    src="https://github.com/user-attachments/assets/2dc6ad1d-5ae8-429b-a353-bfdcba53cb78" />
</p>

<br>

<p><strong>Product Detail Page</strong></p>
<p>
  <img width="800" alt="Product Detail Screenshot"
    src="https://github.com/user-attachments/assets/f4855735-a6fb-4bca-91b2-610e7543a635" />
</p>


<br>

<h3>AI Tool Usage (Milestone 3)</h3>

<p>
AI tools were used to support debugging and implementation during Milestone 3. Specifically, AI assisted with:
</p>

<ul>
  <li>Configuring CORS so the React app could call the .NET API</li>
  <li>Writing fetch logic for <code>GET /api/products</code> and <code>GET /api/products/{id}</code></li>
  <li>Setting up React Router for the Product Detail page</li>
  <li>Clarifying loading and empty state patterns</li>
</ul>

<p>
A detailed record of prompts, what was accepted, and what was modified is included in the GitHub commit messages for this milestone.
</p>

