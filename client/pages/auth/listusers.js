import buildClient from "../../api/build-client";

const ListUsersPage = ({ userlist }) => {
  console.debug("[ListUsersPage]", userlist);

  const users = (userList) => {
    const userArray = userList.users;
    return userArray.map(({id, email, iat}) => {
      return <tr key={id}><td>{id}</td><td>{email}</td><td>{iat}</td></tr>
    })
  };
  /*
  */
  return (<div>
          <h1>Users</h1>
          <table className="table">
            <thead>
              <tr><th>id</th><th>email</th><th>iat</th></tr>
            </thead>
            <tbody>
              {users(userlist)}
            </tbody>
          </table>
        </div>);
}
/*
 * This is only executed during server side rendering.
 */
ListUsersPage.getInitialProps = async (context, client, currentUser) => {
  //const client = buildClient(context);
  //console.debug("[listusers::get] ------------------------ getInitialProps ------------------------");
  const { data } = await client.get('/api/users/list');
  //console.log(data);
  //console.debug("[listusers::exit] ------------------------ getInitialProps ------------------------");
  return { userlist: data};
};

export default ListUsersPage;