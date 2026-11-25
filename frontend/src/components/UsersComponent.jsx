
import useFetch from "../hooks/useFetch";

function UsersComponent() {

  // Reuse the custom hook
  const {
    data: users,
    loading,
    error
  } = useFetch("https://jsonplaceholder.typicode.com/users");

  return (
    <div>

      <h2>Users List</h2>

      {loading && <p>Loading users...</p>}

      {error && <p>Error: {error}</p>}

      {users && users.map((user) => (
        <p key={user.id}>
          {user.name} - {user.email}
        </p>
      ))}

    </div>
  );
}

export default UsersComponent;
