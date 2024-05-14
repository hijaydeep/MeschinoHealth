'use client';
 
import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid'
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'
 
const ConditionListCards = () => {
 
  const [userCounts, setUserCounts] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    pendingUsers: 0
  });
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/apps/condition/list');
        if (res.status === 200) {
          const data = await res.json();
          const totalUsers = data.users.filter(user => user.status).length;
          const activeUsers = data.users.filter(user => user.status === 'active').length;
          const inactiveUsers = data.users.filter(user => user.status === 'inactive').length;
          const pendingUsers = data.users.filter(user => user.status === 'pending').length;
          setUserCounts({
            totalUsers,
            activeUsers,
            inactiveUsers,
            pendingUsers
          });
        }
 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
 
    fetchUsers();
  }, []);
 
  // Vars
  const data = [
    {
      title: 'All',
      value: userCounts.totalUsers.toLocaleString(),
      avatarIcon: 'ri-group-line',
      avatarColor: 'primary',
      // change: 'positive',
      // changeNumber: '29%',
      subTitle: 'Total Condition'
    },

    {
      title: 'Published Condition',
      value: userCounts.activeUsers.toLocaleString(),
      avatarIcon: 'ri-user-follow-line',
      avatarColor: 'success',
      // change: 'negative',
      // changeNumber: '14%',
      subTitle: 'Published Condition'
    },

    {
      title: 'Pending Condition',
      value: userCounts.pendingUsers.toLocaleString(),
      avatarIcon: 'ri-user-search-line',
      avatarColor: 'warning',
      // change: 'positive',
      // changeNumber: '42%',
      subTitle: 'Pending Condition'
    },

    {
      title: 'Inactive Condition',
      value: userCounts.inactiveUsers.toLocaleString(),
      avatarIcon: 'ri-user-add-line',
      avatarColor: 'error',
      // change: 'positive',
      // changeNumber: '18%',
      subTitle: 'Inactive Condition'
    }
  ]
 
  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={3}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}
 
export default ConditionListCards;
