import { Breadcrumb } from 'antd';
import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // ✅ FIX

const User = () => {
  return (
    <>
      <Breadcrumb
        separator={<RightOutlined />}
        items={[
          { title: <Link to="/dashboard">Dashboard</Link> },
          { title: 'Users' },
        ]}
      />
    </>
  );
};

export default User;