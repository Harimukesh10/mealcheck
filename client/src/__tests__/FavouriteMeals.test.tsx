
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import FavouriteMeals from '../pages/FavouriteMeals';
import api from '../api';
import { BrowserRouter as Router } from 'react-router-dom';
import  ToastProvider  from "../context/ToastContext"; // Ensure correct import

jest.mock('../api');
jest.mock('../api', () => ({

  get: jest.fn(),
  delete: jest.fn()
  
}));
const mockMeals = [
  {
    mealId: '1',
    name: 'Burger',
    category: 'nonveg',
    cuisine: 'American',
    thumbnailImg: 'img1.jpg',
  },
  {
    mealId: '2',
    name: 'Dosa',
    category: 'veg',
    cuisine: 'Indian',
    thumbnailImg: 'img2.jpg',
  },
  {
    mealId: '3',
    name: 'Noodles',
    category: 'veg',
    cuisine: 'Chinese',
    thumbnailImg: 'img3.jpg',
  },
];

describe('FavouriteMeals Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        paginatedMeals: mockMeals,
        totalPages: 1,
      },
    });
    (api.delete as jest.Mock).mockResolvedValue({});
  });



  it('renders favourite meals after loading', async () => {
    render(
      <Router>
        <ToastProvider>
          <FavouriteMeals />
        </ToastProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Favourite Meals')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Burger')).toBeInTheDocument();
      expect(screen.getByText('Noodles')).toBeInTheDocument();
      expect(screen.getByText('Dosa')).toBeInTheDocument();
     
      
    
    });
  });

  it('removes a favourite meal', async () => {
    render(
      <Router>
        <ToastProvider>
          <FavouriteMeals />
        </ToastProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Favourite Meals')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByRole('button');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/removefavourite/1');
      expect(screen.queryByText('Burger')).not.toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching favourites'));

    render(
      <Router>
        <ToastProvider>
          <FavouriteMeals />
        </ToastProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Error fetching favourites')).toBeInTheDocument();
    });
  });
});
