import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import MealSearch from '../pages/MealList';
import api from '../api';
import { externalApi } from '../api';
import { BrowserRouter as Router } from 'react-router-dom';
import ToastProvider from "../context/ToastContext"; // Ensure correct import

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  externalApi: {
    get: jest.fn(),
  },
  get: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(),
}));

const mockMeal = {
  idMeal: '1',
  strMeal: 'Burger',
  strCategory: 'nonveg',
  strArea: 'American',
  strMealThumb: 'img1.jpg',
  strInstructions: 'Instructions for Meal 1',
  strIngredient1: 'Ingredient 1',
  strMeasure1: '1 cup',
  strIngredient2: 'Ingredient 2',
  strMeasure2: '2 tbsp',
};

const mockFavorites = [
  { mealId: '1' },
  { mealId: '2' },
];

const mockCategories = [
  { idCategory: '1', strCategory: 'nonveg' },
  { idCategory: '2', strCategory: 'veg' },
];

describe('MealSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (externalApi.get as jest.Mock).mockResolvedValue({
      data: {
        meals: [mockMeal],
        categories: mockCategories,
      },
    });
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        meals: mockFavorites,
      },
    });
    (api.delete as jest.Mock).mockResolvedValue({});
    (api.post as jest.Mock).mockResolvedValue({});
  });

  it('renders initial state correctly', async () => {
    render(
      <Router>
        <ToastProvider>
          <MealSearch />
        </ToastProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Meal Search')).toBeInTheDocument();

    });
  });

  it('fetches and displays initial meals', async () => {
    render(
      <Router>
        <ToastProvider>
          <MealSearch />
        </ToastProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(mockMeal.strMeal)).toBeInTheDocument();
    });
  });

  it('searches for meals by name', async () => {
    render(
      <Router>
        <ToastProvider>
          <MealSearch />
        </ToastProvider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Search by Name'), { target: { value: 'Burger' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(externalApi.get).toHaveBeenCalledWith('/search.php?s=Burger');
      expect(screen.getByText(mockMeal.strMeal)).toBeInTheDocument();
    });
  });

  it('toggles favorite status', async () => {
    render(
      <Router>
        <ToastProvider>
          <MealSearch />
        </ToastProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(mockMeal.strMeal)).toBeInTheDocument();
    });

  
const favoriteButton = screen.getByRole('button', { name: `favorite-button-${mockMeal.idMeal}` }); fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(`/removefavourite/${mockMeal.idMeal}`);
      expect(api.post).toHaveBeenCalledWith('/addfavourite', {
        mealId: mockMeal.idMeal,
        mealName: mockMeal.strMeal,
        thumbnailImg: mockMeal.strMealThumb,
      });
    });
  });

  it('handles error state', async () => {
    (externalApi.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching meal details'));

    render(
      <Router>
        <ToastProvider>
          <MealSearch />
        </ToastProvider>
      </Router>
    );

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
        expect(screen.getByText((content, element) => {
          return element?.textContent === 'Failed to fetch meals. Please try again.';
        })).toBeInTheDocument();
      });
      
  });
});
