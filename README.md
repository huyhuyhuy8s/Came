
# Came - Vietnamese Coffee Shop Application

## Overview

Came is a modern web application for a Vietnamese coffee shop that allows customers to browse the menu, place orders, track deliveries, and participate in promotional campaigns. The application is built with React, TypeScript, and Tailwind CSS to provide a responsive and intuitive user experience.

## Live Demo

You can access the live application at: [https://came-iota.vercel.app](https://came-iota.vercel.app)

## Features

- **Browse Menu**: View a variety of Vietnamese coffee selections, food items, and beverages
- **User Authentication**: Register, sign in, and manage your account
- **Shopping Cart**: Add products to cart and manage quantity
- **Order Tracking**: Follow your order's status in real-time
- **Promotional Campaigns**: Discover and participate in ongoing promotions and deals
- **Support System**: Get help through the integrated support ticket system
- **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API, TanStack Query
- **Routing**: React Router
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Build Tool**: Vite

## Local Development Setup

### Prerequisites

- Node.js (v16.0 or higher)
- npm (v7.0 or higher)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/your-username/came.git
cd came
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open the application**

Open your browser and navigate to `http://localhost:8080`

## Environment Variables

To run this project locally, you may need to set up the following environment variables in a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
came/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Third-party integrations
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── App.tsx          # App component
│   └── main.tsx         # Application entry point
├── .env                 # Environment variables (create locally)
└── ...                  # Configuration files
```

## Limitations

- The application currently uses mock data for some features
- Payment processing is simulated and not connected to real payment gateways
- The live demo may have limited functionality compared to a production environment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Made with Lovable

This project was created with [Lovable](https://lovable.dev/projects/f5c657a0-b0c0-4408-bb36-c9486cb49582), an AI-powered web application development platform.
