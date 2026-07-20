import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Provider, useDispatch } from 'react-redux'
import './index.css'
import { store } from './store/store.js'
import { setUser } from './store/authSlice'
import { getCurrentUser } from './services/api'

// Pages
import Home from './pages/Home.jsx'
import AuthPage from './pages/AuthPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import CartPage from './pages/CartPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import CollectionsPage from './pages/CollectionsPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import CategoryDetailPage from './pages/CategoryDetailPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/products/:slug',
    element: <ProductDetailPage />,
  },
  {
    path: '/cart',
    element: <CartPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/collections',
    element: <CollectionsPage />,
  },
  {
    path: '/categories',
    element: <CategoriesPage />,
  },
  {
    path: '/category/:categorySlug',
    element: <CategoryDetailPage />,
  },
  {
    path: '/shop',
    element: <ShopPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

function AppWrapper({ children }) {
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        const user = res.data?.data;
        if (user) {
          dispatch(setUser({ user }));
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [dispatch]);

  if (checking) {
    return (
      <div className="min-h-screen bg-white text-black font-space flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-10 h-10 border-4 border-black border-t-transparent animate-spin mb-4 shrink-0 rounded-none" />
        <span className="font-space text-xs font-bold uppercase tracking-widest text-neutral-400">
          LOADING PROFILE...
        </span>
      </div>
    );
  }

  return children;
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppWrapper>
      <RouterProvider router={router} />
    </AppWrapper>
  </Provider>
)
