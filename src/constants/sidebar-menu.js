import DashboardIcon from '../assets/icons/dashboard.svg';
import ShippingIcon from '../assets/icons/shipping.svg';
import ProductIcon from '../assets/icons/product.svg';
import UserIcon from '../assets/icons/user.svg';
import App from '../App';

const sidebar_menu = [
    {
        id: 1,
        icon: DashboardIcon,
        path: '/AdHome',
        title: 'Dashboard',
    },
    {
        id: 2,
        icon: ShippingIcon,
        // icon: ProductIcon,
        path: 'Orders',
        title: 'Orders',
    },
    {
        id: 3,
        icon: ShippingIcon,
        path: 'Booking',
        title: 'Booking',
    },
    {
        id: 4,
        icon: UserIcon,
        path: '/profile',
        title: 'My account',
    }
]

export default sidebar_menu;