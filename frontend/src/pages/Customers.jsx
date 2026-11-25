// Customers page: list and add customers (backend "users" — the people orders are placed for).
import { useState } from "react";
import useApi from "../hooks/useApi";
import { usersApi } from "../api/resources";
import { filterBySearch, formatDate } from "../utils/format";
import AsyncState from "../components/ui/AsyncState";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import CustomerForm from "../components/CustomerForm";

// ---------- Table columns ----------
const COLUMNS = [
  { key: "username", header: "Username", render: (u) => <strong>{u.username}</strong> },
  { key: "email", header: "Email" },
  { key: "phoneNumber", header: "Phone" },
  { key: "createdAt", header: "Joined", render: (u) => formatDate(u.createdAt) },
];

function Customers() {
  // ---------- State ----------
  const query = useApi(usersApi.list);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const closeForm = () => setShowForm(false);

  function handleSaved() {
    closeForm();
    query.reload();
  }

  // ---------- Markup ----------
  return (
    <>
      <PageHeader title="Customers" subtitle="People you can place orders for.">
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add customer
        </button>
      </PageHeader>

      <div className="card">
        <input
          type="search"
          className="search"
          placeholder="Search by username, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <AsyncState {...query}>
          {query.data && (
            <DataTable
              columns={COLUMNS}
              rows={filterBySearch(query.data, search, ["username", "email", "phoneNumber"])}
              emptyText="No customers found."
            />
          )}
        </AsyncState>
      </div>

      {showForm && (
        <Modal title="Add customer" onClose={closeForm}>
          <CustomerForm onSaved={handleSaved} onCancel={closeForm} />
        </Modal>
      )}
    </>
  );
}

export default Customers;
