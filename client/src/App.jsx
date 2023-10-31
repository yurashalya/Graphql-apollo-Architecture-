
import React, { useState,  useCallback} from 'react';

import { useQuery, useMutation } from '@apollo/client';

import { CREATE_USER, GET_ALL_USERS, GET_ONE_USER } from './services';

import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [username, setUserName] = useState('');
  const [age, setAge] = useState(0);

  const { loading: isLoadingGetAllUsers,  refetch: refetchGetAllUsers } = useQuery(GET_ALL_USERS, {
    onCompleted: (data) => {
      setUsers(data.getAllUsers);
     
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
  });

  const {data: user } = useQuery(GET_ONE_USER, {
    variables:{
      id: 1
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
  });

  console.log("user", user)

  const [saveNewUser] = useMutation(CREATE_USER,{
    refetchQueries: [
      {
        query: GET_ALL_USERS,
        awaitRefetchQueries: true,
      },
    ],
  });

  const handleUserName = (e) => {
    setUserName(e.target.value)
  };

  const handleUserAge = (e) => {
    setAge(+e.target.value)
  };

  const handleAddUser =   (e) => {
    e.preventDefault();

    saveNewUser({
      variables: {
        input: { username, age }
      }
    }).then(async() => {
      setUserName("");
      setAge(0);
      await  refetchGetAllUsers();
    })
  };

  const getAllUsers = async(e) => {
    e.preventDefault();
    await refetchGetAllUsers();
  };

  const RenderUsers = useCallback(() => {
    return (
      users.map(user => (
        <div className="user" key={user.id}>
          {user.id}. {user.username} {user.age}
        </div>
      ))
    );
  }, [users]);

  return (
    <div>
        <form>
            <input value={username} onChange={(e) => handleUserName(e)}  type="text"/>
            <input value={age} onChange={(e) => handleUserAge(e)} type="number" />
            <div className="btns">
                <button onClick={handleAddUser} >Create user</button>
                <button onClick={getAllUsers}>Get users</button>
            </div>
        </form>
        <div>
        {isLoadingGetAllUsers ?  <h1>Loading...</h1> :  <RenderUsers  />}
        </div>
    </div>
  );
}

export default App;
