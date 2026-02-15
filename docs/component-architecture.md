<h2>Component Architecture (Atomic Design)</h2>

<p>
This component hierarchy applies Atomic Design to the <strong>Product Catalog</strong> feature only. It breaks the catalog UI into reusable components that support fast browsing, clear listing details, and intuitive filtering—addressing pain points from the Milestone 1 personas and journey map.
</p>

<br>

<h3>Atoms</h3>
<ul>
  <li>Button</li>
  <li>Text (Typography)</li>
  <li>Input</li>
  <li>Label</li>
  <li>Icon</li>
  <li>Image</li>
  <li>Card Container</li>
  <li>Tag/Badge (Category Tag, Condition Label)</li>
  <li>Price Tag</li>
  <li>Avatar</li>
</ul>

<h3>Molecules</h3>
<ul>
  <li>Search Bar (Input + Button/Icon)</li>
  <li>Filter Group (Label + Dropdown/Control)</li>
  <li>Filter Panel (multiple Filter Groups)</li>
  <li>Seller Info Row (Avatar + Seller Name + Active/Inactive Status)</li>
  <li>Listing Card Header (Image + Price Tag)</li>
  <li>Listing Card Details (Title + Condition Label + Category Tag)</li>
</ul>

<h3>Organisms</h3>
<ul>
  <li>Listing Card (Header + Details + Seller Info Row)</li>
  <li>Product Grid (collection of Listing Cards)</li>
  <li>Filter Sidebar (Filter Panel + Apply/Reset Buttons)</li>
  <li>Catalog Header (Page Title + Search Bar)</li>
</ul>

<h3>Templates</h3>
<ul>
  <li>Product Catalog Template (Catalog Header + Filter Sidebar + Product Grid)</li>
</ul>

<h3>Pages</h3>
<ul>
  <li>Product Catalog Page (uses Product Catalog Template)</li>
</ul>

<br>

<h3>Connection to Milestone 1</h3>
<p>
This structure supports <strong>Alex</strong> by enabling fast, organized browsing through reusable Search and Grid components. <strong>Maya</strong> benefits from clear Listing Cards with consistent photos, condition, and category details to reduce uncertainty. <strong>Jordan</strong> benefits from consistent Seller Info display (including active/inactive status) to reduce wasted time coordinating with unresponsive buyers. These components directly address journey map pain points like cluttered browsing, unclear item condition, and inconsistent seller responsiveness.
</p>
