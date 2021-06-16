import Home from '@/components/Home';
import Login from '@/components/Login'
import Ask from '@/components/Ask';
import Newest from '@/components/Newest';
import Threads from '@/components/Threads';
import Edit from '@/components/Edit';
import Delete from '@/components/Delete';
import User from '@/components/User';
import Item from '@/components/Item';
import Reply from '@/components/Reply';
import Submit from '@/components/Submit';
import Submission from '@/components/Submission';
import Upvotedcomments from "./components/Upvotedcomments.vue";
import Upvotedsubmissions from "./components/Upvotedsubmissions.vue";


export const routes = [
    {
        path: '/login' , name: 'Login', component: Login 
    },
    {
        path: '/' , name: 'Home', component: Home 
    },
    {
        path: '/news' , name: 'News', component: Home
    },
    {
        path: '/newest' , name: 'Newest', component: Newest 
    },
    {
        path: '/ask' , name: 'Ask', component: Ask 
    },
    {
        path: '/threads' , name: 'Threads', component: Threads
    },
    {
        path: '/edit' , name: 'Edit', component: Edit
    },
    {
        path: '/delete-confirm' , name: 'Delete', component: Delete
    },
    {
        path: '/user', name: 'User', component: User
    },
    {
        path: '/reply', name: 'Reply', component: Reply
    },
    {
        path: '/item', name: 'item', component: Item
    },
    {
        path: '/submit', name: 'Submit', component: Submit
    },
    {
        path: '/submitted', name: 'Submission', component: Submission
    },
    {
        path: '/upvotedcomments' , name: 'Upvotedcomments', component: Upvotedcomments
    },
    {
        path: '/upvotedsubmissions' , name: 'Upvotedsubmissions', component: Upvotedsubmissions
    },
];

