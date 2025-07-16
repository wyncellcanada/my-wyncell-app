'use client';

import { useState, useEffect, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAppContext } from '../../context/AppContext';
import SiteLayout from '../SiteLayout';

// This is the form component that contains the Stripe payment fields.
const CheckoutForm = ({ packageInfo }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { text, language } = useAppContext();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    // Determine the currency and format the price for display.
    const currency = packageInfo.currency || 'USD';
    const formattedPrice = new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency,
    }).format(packageInfo.price);
    const displayPrice = `${formattedPrice} ${currency}`;

    // This function handles the form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setProcessing(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            setProcessing(false);
            return;
        }

        // Send the payment method to your backend API to create the charge.
        const response = await fetch('/api/charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                payment_method_id: paymentMethod.id,
                package_id: packageInfo.id,
                amount: Math.round(packageInfo.price * 100),
                currency: packageInfo.currency.toLowerCase()
            })
        });
        const result = await response.json();

        if (result.error) {
            setError(result.details || result.error);
        } else if (result.requires_action) {
            // Handle payments that require 3D Secure authentication.
            const { error: errorAction } = await stripe.handleNextAction(result.client_secret);
            if (errorAction) setError(errorAction.message);
        } else {
            console.log("Payment successful!");
            window.location.href = '/payment-success'; // Redirect to a success page.
        }
        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg text-gray-800">{text.checkout.orderSummary}</h3>
                <p className="text-gray-600">{text.checkout.plan}: {packageInfo.name}</p>
                <p className="text-gray-600">{text.checkout.price}: {displayPrice}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{text.checkout.cardDetails}</label>
                <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-white">
                    <CardElement options={{ style: { base: { fontSize: '16px', color: '#333' } } }} />
                </div>
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button type="submit" disabled={!stripe || processing} className="w-full font-semibold py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400">
                {processing ? text.checkout.processing : `${text.checkout.pay} ${displayPrice}`}
            </button>
        </form>
    );
};

// This component manages the overall state of the checkout page.
const CheckoutPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClientComponentClient();
    const { text } = useAppContext();
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const { cart, setCart } = useCart();

    // Effect to initialize the cart from URL parameters if it's not already set.
    useEffect(() => {
        if (!cart) {
            const packageId = searchParams.get('package_id');
            if (packageId) {
                setCart({
                    id: packageId,
                    name: searchParams.get('name'),
                    price: searchParams.get('price'),
                    currency: searchParams.get('currency') || 'USD',
                });
            }
        }
    }, [cart, setCart, searchParams]);

    // Effect to check if the user is logged in. If not, redirect to the login page.
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                const redirectTo = window.location.pathname + window.location.search;
                router.push(`/login?redirect_to=${encodeURIComponent(redirectTo)}`);
            } else {
                setIsAuthenticating(false);
            }
        };
        if (cart) {
            checkUser();
        } else {
            setIsAuthenticating(false);
        }
    }, [supabase, router, cart]);

    if (isAuthenticating) {
        return <div className="text-center p-8">{text.checkout.loading}</div>;
    }

    if (!cart) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-semibold mb-4">{text.checkout.emptyCartTitle}</h2>
                <p className="text-gray-600 mb-6">{text.checkout.emptyCartSubtitle}</p>
                <Link href="/esims" className="font-semibold py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {text.checkout.viewPlans}
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{text.checkout.secureCheckout}</h1>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <CheckoutForm packageInfo={cart} />
            </div>
        </div>
    );
};

// Load the Stripe.js script.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// The main page component that wraps everything in the necessary providers.
export default function CheckoutPage() {
    return (
        <SiteLayout>
            <div className="flex items-center justify-center py-12 bg-gray-50">
                <Suspense fallback={<div className="text-center">Loading Checkout...</div>}>
                    <Elements stripe={stripePromise}>
                        <CheckoutPageContent />
                    </Elements>
                </Suspense>
            </div>
        </SiteLayout>
    );
};
