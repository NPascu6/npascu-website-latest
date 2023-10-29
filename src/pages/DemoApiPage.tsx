




import React from 'react';
import ReusableTable from '../components/common/ReusableTable';
import { Item, Order, ReusableColumn, User } from '../models/common/common';
import dayjs from 'dayjs';
import CollapsibleSection from '../components/common/CollapsableSection';

// Dummy data for Users
export const usersData: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'User',
        createdAt: '2022-01-01',
        updatedAt: '2022-02-15',
        orders: [],
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        role: 'Admin',
        createdAt: '2022-03-10',
        updatedAt: '2022-04-25',
        orders: [],
    },
    {
        id: '3',
        name: 'Alice Johnson',
        email: 'alicejohnson@example.com',
        role: 'User',
        createdAt: '2022-05-20',
        updatedAt: '2022-06-30',
        orders: [],
    },
    {
        id: '4',
        name: 'Bob Williams',
        email: 'bobwilliams@example.com',
        role: 'User',
        createdAt: '2022-07-15',
        updatedAt: '2022-08-28',
        orders: [],
    },
    {
        id: '5',
        name: 'Eve Davis',
        email: 'evedavis@example.com',
        role: 'Admin',
        createdAt: '2022-09-05',
        updatedAt: '2022-10-12',
        orders: [],
    },
];

// Dummy data for Items
export const itemsData: Item[] = [
    {
        id: '101',
        name: 'Item A',
        description: 'This is item A.',
        category: 'Category X',
        createdAt: '2022-01-10',
        updatedAt: '2022-02-20',
    },
    {
        id: '102',
        name: 'Item B',
        description: 'This is item B.',
        category: 'Category Y',
        createdAt: '2022-03-15',
        updatedAt: '2022-04-30',
    },
    {
        id: '103',
        name: 'Item C',
        description: 'This is item C.',
        category: 'Category Z',
        createdAt: '2022-05-25',
        updatedAt: '2022-06-25',
    },
    {
        id: '104',
        name: 'Item D',
        description: 'This is item D.',
        category: 'Category X',
        createdAt: '2022-07-20',
        updatedAt: '2022-08-05',
    },
    {
        id: '105',
        name: 'Item E',
        description: 'This is item E.',
        category: 'Category Z',
        createdAt: '2022-09-10',
        updatedAt: '2022-10-18',
    },
];

// Dummy data for Orders
export const ordersData: Order[] = [
    {
        id: '201',
        user: usersData[0],
        items: [itemsData[0], itemsData[1]],
        createdAt: '2022-01-15',
        updatedAt: '2022-02-25',
    },
    {
        id: '202',
        user: usersData[1],
        items: [itemsData[2]],
        createdAt: '2022-03-20',
        updatedAt: '2022-04-10',
    },
    {
        id: '203',
        user: usersData[2],
        items: [itemsData[3], itemsData[4]],
        createdAt: '2022-05-05',
        updatedAt: '2022-06-15',
    },
    {
        id: '204',
        user: usersData[3],
        items: [itemsData[0], itemsData[2], itemsData[4]],
        createdAt: '2022-07-12',
        updatedAt: '2022-08-30',
    },
    {
        id: '205',
        user: usersData[4],
        items: [itemsData[1], itemsData[3]],
        createdAt: '2022-09-15',
        updatedAt: '2022-10-10',
    },
];



const UsersTable = () => {
    // Define the columns and data for the Users table
    const columns: ReusableColumn[] = [
        { header: 'ID', key: 'id', hidden: true },
        { header: 'Name', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Role', key: 'role' },
        { header: 'Created At', key: 'createdAt', cellRenderer: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'), hidden: true },
        { header: 'Updated At', key: 'updatedAt', cellRenderer: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'), hidden: true },
    ];

    return (
        <ReusableTable
            columns={columns}
            data={usersData}
        />
    );
};

const ItemsTable = () => {
    // Define the columns and data for the Items table
    const columns = [
        { header: 'ID', key: 'id', hidden: true },
        { header: 'Name', key: 'name' },
        { header: 'Description', key: 'description' },
        { header: 'Category', key: 'category' },
        { header: 'Created At', key: 'createdAt', cellRenderer: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'), hidden: true },
        { header: 'Updated At', key: 'updatedAt', cellRenderer: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'), hidden: true },
        // Add more columns as needed
    ];

    return (
        <ReusableTable
            columns={columns}
            data={itemsData}
        />
    );
};

const OrdersTable = () => {
    // Define the columns and data for the Orders table
    const columns = [
        { header: 'ID', key: 'id', hidden: true },
        { header: 'User', key: 'user', cellRenderer: (user: User) => user.name },
        { header: 'Items', key: 'items', cellRenderer: (items: Item[]) => items.map(item => item.name).join(', ') },
        { header: 'Created At', key: 'createdAt', cellRenderer: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'), hidden: true },
        { header: 'Updated At', key: 'updatedAt', cellRenderer: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'), hidden: true },
    ];

    return (
        <ReusableTable
            columns={columns}
            data={ordersData}
        />
    );
};

const DemoApiPage = () => {
    return (
        <div className='p-2'>
            <CollapsibleSection title="Users">
                <UsersTable />
            </CollapsibleSection>
            <CollapsibleSection title="Items">
                <ItemsTable />
            </CollapsibleSection>
            <CollapsibleSection title="Orders">
                <OrdersTable />
            </CollapsibleSection>

        </div>
    );
}

export default DemoApiPage;