import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Provider, useDispatch } from 'react-redux'
import './index.css'
import { store } from './store/store.js'
import { fetchCurrentUser } from './store/authSlice'
import { fetchCart } from './store/cartSlice'

// Pages
import Home from './pages/Home.jsx'
import AuthPage from './pages/AuthPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import CartPage from './pages/CartPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import OrderDetailPage from './pages/OrderDetailPage.jsx'
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
    path: '/orders/:orderId',
    element: <OrderDetailPage />,
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

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((action) => {
      if (fetchCurrentUser.fulfilled.match(action) && action.payload) {
        dispatch(fetchCart());
      }
    });
  }, [dispatch]);

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper>
        <RouterProvider router={router} />
      </AppWrapper>
    </Provider>
  </StrictMode>
)
