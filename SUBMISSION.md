# SUBMISSION.md  
ACCTMIS 4630 — Milestone 5  
Buckeye Marketplace — Authentication, Security & Order Processing

---

## 1. Test Accounts

### **Admin User (seeded automatically)**
These credentials come from `DataSeeder` and work on every fresh database:

- **Email:** admin@buckeye.local  
- **Password:** Admin@1234!  
- **Role:** Admin  

### **Regular User (created manually through Register page)**
A working test account for graders:

- **Email:** testuser@example.com  
- **Password:** TestUser123!  
- **Role:** User  

---

## 2. Security Practices Applied (3+ required)

### **1. Secrets stored in User Secrets**
The JWT signing key is stored using `dotnet user-secrets` and never committed to source control, preventing credential leakage.

### **2. JWT claim‑scoped authorization**
Endpoints such as `/api/orders/mine` derive the user ID from the JWT (`ClaimTypes.NameIdentifier`), preventing broken access control attacks.

### **3. SQL Injection protection via LINQ**
All database access uses Entity Framework LINQ; no `FromSqlRaw` or string‑interpolated SQL is used, eliminating SQL injection risk.

### **4. HTTPS redirection**
`app.UseHttpsRedirection()` ensures encrypted transport, protecting credentials and tokens.

### **5. XSS protection**
No usage of `dangerouslySetInnerHTML`; React’s default escaping prevents stored/reflected XSS.

---

## 3. AI Usage Documentation

Full AI usage log is available here:

➡️ **[AI-USAGE.md](./AI-USAGE.md)**

---

## 4. Verification Checklist

### **Backend**
- [x] `dotnet build` succeeds with no warnings related to my code  
- [x] `dotnet test` passes (3+ unit tests, 1+ integration test)  
- [x] Admin user is seeded on a fresh database  

### **Frontend**
- [x] `npm test -- --run` passes (3+ unit/component tests)  
- [x] Auth reducer tests added and passing  

### **End-to-End**
- [x] `npx playwright test` runs the committed E2E spec end‑to‑end  
- [x] `docs/e2e-run.md` included  

### **Security**
- [x] No secrets committed (`git grep -i "Jwt:Key\|password\|secret"` checked)  
- [x] 3+ security practices applied (listed above)  
- [x] Common vulnerabilities addressed (SQL injection, XSS, broken access control)  

---

## 5. Notes for Graders
- Admin account is seeded automatically via `DataSeeder`.  
- Regular user can be created through the Register page using the credentials above.  
- The authenticated Orders integration test now runs without modifying production code and passes under the in-memory test host.  

---

## 6. Local User-Secrets Setup (Required to Run)

The backend requires a JWT signing key from ASP.NET Core user-secrets.

From `backend/BuckeyeMarketplaceApi`, run:

```bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "ReplaceWithYourOwnLongRandomKey_AtLeast32Chars"
```

Then start the app:

```bash
dotnet restore
dotnet run
```

Notes:
- Any strong key works for local grading as long as `Jwt:Key` is configured.
- The JWT key is intentionally not committed to source control.