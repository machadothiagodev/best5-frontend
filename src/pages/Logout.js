import { deleteAuthToken } from "../util/auth";
import { redirect } from "react-router-dom";

export function action() {
    deleteAuthToken();
    return redirect('/rankings');
}