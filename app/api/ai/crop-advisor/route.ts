import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { crop, soilType, season, location } = await request.json();

    // Validate inputs
    if (!crop || !soilType || !season) {
      return NextResponse.json(
        { error: 'Missing required fields: crop, soilType, season' },
        { status: 400 }
      );
    }

    // Mock AI response - Replace with actual OpenAI API call
    const mockAdvice = {
      crop,
      season,
      soilType,
      recommendations: {
        fertilizers: [
          {
            name: 'NPK 10:26:26',
            quantity: '50kg per acre',
            reason: 'Best for fruit development',
            price: '₹450',
          },
          {
            name: 'Organic Compost',
            quantity: '2-3 tons per acre',
            reason: 'Improves soil health',
            price: '₹100/kg',
          },
          {
            name: 'Micronutrient Mix',
            quantity: '10kg per acre',
            reason: 'Prevents deficiency diseases',
            price: '₹350',
          },
        ],
        pesticides: [
          {
            name: 'Neem Oil',
            dosage: '5% solution',
            reason: 'Organic pest control',
            price: '₹180/liter',
          },
          {
            name: 'Spinosad',
            dosage: '0.5ml per liter',
            reason: 'Effective against caterpillars',
            price: '₹220/liter',
          },
        ],
        seeds: [
          {
            name: `Hybrid ${crop} seeds`,
            variety: 'High-yield variety',
            quantity: '2.5kg per acre',
            price: '₹1200/kg',
          },
          {
            name: `Premium ${crop} seeds`,
            variety: 'Disease resistant',
            quantity: '2.5kg per acre',
            price: '₹800/kg',
          },
        ],
        tools: [
          {
            name: 'Drip Irrigation Kit',
            area: 'For 1 acre',
            benefit: 'Saves 40% water',
            price: '₹3500',
          },
          {
            name: 'Hand Sprayer',
            capacity: '15 liters',
            benefit: 'Precise pesticide application',
            price: '₹450',
          },
        ],
        tips: [
          `Sow ${crop} in ${season} season for best results`,
          'Maintain soil moisture level at 60-70%',
          'Monitor for pest infestations weekly',
          'Harvest at proper maturity stage',
          'Rotate crops yearly to prevent soil depletion',
          'Use certified seeds for better yield',
        ],
        waterSchedule: {
          frequency: 'Every 3-4 days',
          timing: 'Early morning or evening',
          amount: '1-1.5 inches per week',
        },
        expectedYield: '25-30 tons per acre',
        harvestingTime: '120-150 days after sowing',
      },
    };

    return NextResponse.json(mockAdvice);
  } catch (error) {
    console.error('Crop advisor error:', error);
    return NextResponse.json(
      { error: 'Failed to get crop recommendations' },
      { status: 500 }
    );
  }
}
