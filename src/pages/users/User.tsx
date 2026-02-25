import { Breadcrumb } from 'antd';
import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getUsers } from '../../http/api';
import { useQuery } from '@tanstack/react-query';
import type { User } from '../../types';

const User = () => {
  // fetch users
  const { data: usersResponse, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await getUsers(); // your axios call
      return res.data.data; // ✅ extract the array
    },
  });

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        separator={<RightOutlined />}
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: 'Users' },
        ]}
      />

      {/* Loading & Error */}
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>}

      {/* Users list */}
      {usersResponse && (
        <ul>
          {usersResponse.map((user) => (
            <li key={user.id}>
              {user.firstName} {user.lastName} - {user.email} - Role: {user.role}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default User;