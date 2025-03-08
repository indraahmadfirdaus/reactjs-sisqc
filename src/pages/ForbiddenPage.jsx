import React from 'react';
import { Button, Result } from 'antd';
const ForbiddenPage = () => (
  <Result
    status="warning"
    title="You are forbidden to see this page."
    extra={
      <Button type="primary" danger key="console">
        Logout
      </Button>
    }
  />
);
export default ForbiddenPage;