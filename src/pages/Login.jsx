import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext } from 'react';
import { auth } from '../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/auth';

function Login() {
  const navigate = useNavigate();
  const { error, setLoading, setError, setUser } = useContext(AuthContext);

  const validateHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          setUser(userCredential.user);
        },
      );
      setLoading(false);
      setError(null);
      navigate('/');
    } catch (err) {
      setLoading(false);
      if (err.code === 'auth/user-not-found') {
        setError('User not found');
      }
      if (err.code === 'auth/wrong-password') {
        setError('Wrong password');
      }
      if (
        !err.code === 'auth/wrong-password' ||
        !err.code === 'auth/user-not-found'
      ) {
        setError(e.code);
      }
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <form
        className="flex flex-col items-center justify-around shadow-xl rounded-md w-[20rem] h-[20rem] text-sm font-bold"
        onSubmit={validateHandler}
      >
        {error && (
          <p className="bg-red-700 text-white text-sm px-1.5 py-1.5 rounded-md">
            {error}!
          </p>
        )}
        <label>
          <p className="pb-1">Email</p>
          <input
            type="email"
            required
            className="outline-none w-[14.5rem] rounded-md px-2 py-2 transition-all duration-300  focus:bg-blue-500 focus:text-white"
          />
        </label>
        <label>
          <p className="pb-1">Password</p>
          <input
            type="password"
            required
            minLength={6}
            className="outline-none w-[14.5rem] rounded-md px-2 py-2 transition-all duration-300 focus:bg-blue-500 focus:text-white"
          />
        </label>
        <button
          type="submit"
          className="px-2 py-2 bg-transparent border hover:border-black hover:bg-blue-500 hover:text-white rounded-full tracking-wide transition-all duration-300"
        >
          LOGIN
        </button>
        <div>
          Create an account{' '}
          <Link
            to={'/register'}
            className="text-blue-500 font-extrabold hover:underline underline-offset-2"
            onClick={() => setError(null)}
          >
            Here
          </Link>
        </div>
      </form>
    </main>
  );
}

export default Login;
