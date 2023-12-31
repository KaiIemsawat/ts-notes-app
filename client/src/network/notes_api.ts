import { ConflictError, UnauthorizedError } from "../errors/http_error";
import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMsg = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMsg); // new keyword is need when use class
        } else if (response.status === 409) {
            throw new ConflictError(errorMsg);
        } else {
            throw Error(
                "Request faild with status : " +
                    response.status +
                    " message " +
                    errorMsg
            );
        }
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/api/users", { method: "GET" });
    return response.json();
}

// ! SIGN UP
export interface SignUpCredentials {
    username: string;
    email: string;
    password: string;
}
export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

// ! SIGN IN
export interface LoginCredentials {
    username: string;
    password: string;
}
export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

// ! LOGOUT
export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" });
}

// ----------------- NOTES ----------------
export async function fetchNotes(): Promise<Note[]> {
    // async/await can't be directly in useEffect. But we can create empty async function to contain await
    const response = await fetchData("/api/notes", { method: "GET" });
    return response.json();
}

export interface NoteInput {
    title: string;
    text: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchData("/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    return response.json();
}

export async function updateNote(
    noteId: string,
    note: NoteInput
): Promise<Note> {
    const response = await fetchData(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
    });
    return response.json();
}

export async function deleteNote(noteId: string) {
    await fetchData(`/api/notes/${noteId}`, { method: "DELETE" });
}
