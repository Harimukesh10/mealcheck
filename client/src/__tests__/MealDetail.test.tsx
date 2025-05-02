import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import MealDetail from '../pages/MealDetail';
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

describe('MealDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (externalApi.get as jest.Mock).mockResolvedValue({
      data: {
        meals: [mockMeal],
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

  it('renders loading state initially', () => {
    render(
      <Router>
        <ToastProvider>
          <MealDetail />
        </ToastProvider>
      </Router>
    );
    expect(screen.getByText('Loading Meal Detail...')).toBeInTheDocument();
  });

  it('renders meal details after loading', async () => {
    render(
      <Router>
        <ToastProvider>
          <MealDetail />
        </ToastProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(mockMeal.strMeal)).toBeInTheDocument();
    });

    expect(screen.getByText(mockMeal.strCategory)).toBeInTheDocument();
    expect(screen.getByText(mockMeal.strArea)).toBeInTheDocument();
    expect(screen.getByText(mockMeal.strInstructions)).toBeInTheDocument();
    expect(screen.getByText('Ingredient 1 - 1 cup')).toBeInTheDocument();
    expect(screen.getByText('Ingredient 2 - 2 tbsp')).toBeInTheDocument();
  });

  it('toggles favorite status', async () => {
    render(
      <Router>
        <ToastProvider>
          <MealDetail />
        </ToastProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(mockMeal.strMeal)).toBeInTheDocument();
    });

    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(`/removefavourite/${mockMeal.idMeal}`);
      expect(api.post).toHaveBeenCalledWith('/addfavourite', {
        mealId: mockMeal.idMeal,
        mealName: mockMeal.strMeal,
        category: mockMeal.strCategory,
        cuisine: mockMeal.strArea,
        thumbnailImg: mockMeal.strMealThumb,
      });
    });
  });

  it('handles error state', async () => {
    (externalApi.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching meal details'));

    render(
      <Router>
        <ToastProvider>
          <MealDetail />
        </ToastProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch meal details. Please try again.')).toBeInTheDocument();
    });
  });
});
