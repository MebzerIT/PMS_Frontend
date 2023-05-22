import withAuth from "../../hoc/withAuth";
import { Link } from 'react-router-dom';
import { IoMdChatbubbles, IoIosNotifications } from 'react-icons/io';
import { MdGroup } from 'react-icons/md';
import "./chat.css";

const NotificationsComp = () => (
   <h1>Notifications</h1>
)
export default withAuth(NotificationsComp);