
// Products page: search, add, edit and (soft) delete products.
import { useState } from "react";
import useProducts from "../hooks/useProducts";
import { filterBySearch } from "../utils/format";
import Alert from "../components/ui/Alert";
import AsyncState from "../components/ui/AsyncState";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import { useDeleteProduct } from "../hooks/useProductMutations";

function Products() {
  // ---------- State ----------
  // Fetch products using React Query
  const query = useProducts();

  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null = closed, { product? } = open (product → edit mode)
  const [actionError, setActionError] = useState("");

  const closeModal = () => setModal(null);

  // ---------- Actions ----------
  // function runs after a product is successfully added or edited
  function handleSaved() {
    closeModal();//Closes the form popup
    //Products list automatically refreshes through invalidateQueries()
  }

  //This function deletes the selected product
  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? Past orders keep their history.`)) return;
    //Before deleting, the browser displays a confirmation popup
    setActionError("");
    //Removes any old error message
    try {
      await deleteProduct.mutateAsync(product.id);
      //product.id identifies which product to delete
      //Products list automatically refreshes through invalidateQueries()
    } catch (err) {
      setActionError(err.message);
    }
  }

  // ---------- Markup ----------
  return (
    <>
      {/* Displays the page title and subtitle */}
      <PageHeader title="Products" subtitle="Your catalogue and stock levels.">
        <button type="button" className="btn btn-primary" onClick={() => setModal({})}>
          + Add product
        </button>
      </PageHeader>

      {/* Displays the error message if deleting a product fails */}
      <Alert>{actionError}</Alert>

      <div className="card">
        <input
          type="search"
          className="search"
          placeholder="Search by name or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <AsyncState
          loading={query.isLoading}
          error={query.error?.message}
          reload={query.refetch}
        >
          {query.data && (
            <ProductList
              //Filters the product list using the search text
              products={filterBySearch(query.data, search, ["name", "description"])}
              //When the user clicks Edit, the selected product is passed to the modal
              onEdit={(product) => setModal({ product })}
              //When the user clicks Delete, our handleDelete function runs
              onDelete={handleDelete}
            />
          )}
        </AsyncState>
      </div>

      {/* displays the popup only when modal is not null */}
      {modal && (
        <Modal title={modal.product ? "Edit product" : "Add product"} onClose={closeModal}>
          <ProductForm product={modal.product} onSaved={handleSaved} onCancel={closeModal} />
        </Modal>
      )}
    </>
  );
}

export default Products;
