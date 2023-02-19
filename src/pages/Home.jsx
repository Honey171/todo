import React, { useContext } from 'react';
import TodoCreateInput from '../components/TodoCreateInput';
import Todos from '../components/Todos';
import Spinner from '../components/Spinner';
import { AuthContext } from '../hooks/auth';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <section className="flex flex-col items-center justify-center h-[80vh] w-[22rem] sm:w-[27rem] lg:w-[50rem] xl:w-[65rem] rounded-md shadow-2xl">
        {loading && (
          <div>
            <Spinner />
            <span className="font-extrabold">Loading...</span>
          </div>
        )}
        {!loading && (
          <>
            <div className="flex items-center space-x-20 mb-10 relative px-5 pt-2">
              <p className="text-2xl font-semibold max-w-[210px] break-words">
                Hello,{' '}
                <span className="font-extrabold text-blue-500">
                  {user?.displayName}
                </span>
              </p>
              <button
                className="w-14 h-5 flex items-center justify-center font-bold outline-blue-500"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <MdLogout className="text-2xl hover:text-red-500 transition-all duration-300" />
              </button>
            </div>
            <TodoCreateInput />
            <p className="py-5 text-2xl font-extrabold text-blue-500">
              YOUR TODOS
            </p>
            <Todos />
          </>
        )}
      </section>
    </main>
  );
}

export default Home;
