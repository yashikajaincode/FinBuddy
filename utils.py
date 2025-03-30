import streamlit as st
import json
import pandas as pd
import os
from datetime import datetime
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage, AIMessage

def initialize_session_state():
    """Initialize all session state variables needed for the app"""
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": "Hi! I'm FinBuddy, your financial education assistant. How can I help you learn about budgeting, saving, and investing today?"}
        ]
    
    if "openai_api_key" not in st.session_state:
        st.session_state.openai_api_key = os.environ.get("OPENAI_API_KEY", "")
    
    if "user_budget" not in st.session_state:
        st.session_state.user_budget = {
            "income": [],
            "expenses": []
        }
    
    if "savings_goals" not in st.session_state:
        st.session_state.savings_goals = []
    
    if "investment_progress" not in st.session_state:
        st.session_state.investment_progress = {
            "lessons_completed": 0,
            "quizzes_taken": 0,
            "score": 0
        }
    
    if "user_badges" not in st.session_state:
        st.session_state.user_badges = []
        
    if "user_progress" not in st.session_state:
        st.session_state.user_progress = 0.1  # Starting progress (0.0 to 1.0)
    
    if "financial_health_score" not in st.session_state:
        st.session_state.financial_health_score = None

def load_css():
    """Load custom CSS for the app (minimal, uses mostly Streamlit defaults)"""
    st.markdown("""
        <style>
        .financial-tip {
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
            background-color: #f0f7ff;
        }
        .badge-icon {
            font-size: 24px;
            text-align: center;
        }
        </style>
    """, unsafe_allow_html=True)

def get_llm_response(prompt, system_prompt="You are FinBuddy, an AI assistant that helps users learn about personal finance, budgeting, saving, and investing. Your responses should be friendly, informative, and geared toward financial education for beginners."):
    """
    Get a response from the GPT model via LangChain
    
    Args:
        prompt (str): User prompt
        system_prompt (str): System prompt defining the AI assistant's behavior
    
    Returns:
        str: The AI response
    """
    if not st.session_state.openai_api_key:
        return "Please add your OpenAI API key in the sidebar to use AI features."
    
    try:
        # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
        # do not change this unless explicitly requested by the user
        chat = ChatOpenAI(
            temperature=0.7,
            openai_api_key=st.session_state.openai_api_key,
            model="gpt-4o"
        )
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=prompt)
        ]
        
        response = chat(messages)
        return response.content
    except Exception as e:
        return f"Error: {str(e)}"

def calculate_budget_summary(income, expenses):
    """Calculate budget summary statistics
    
    Args:
        income (list): List of income dictionaries with amount and name
        expenses (list): List of expense dictionaries with amount, name, and category
    
    Returns:
        dict: Summary statistics about the budget
    """
    total_income = sum(item["amount"] for item in income)
    total_expenses = sum(item["amount"] for item in expenses)
    balance = total_income - total_expenses
    
    # Group expenses by category
    expense_by_category = {}
    for expense in expenses:
        category = expense.get("category", "Other")
        if category in expense_by_category:
            expense_by_category[category] += expense["amount"]
        else:
            expense_by_category[category] = expense["amount"]
    
    # Calculate saving rate
    saving_rate = 0
    if total_income > 0:
        saving_rate = max(0, balance) / total_income * 100
    
    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance,
        "expense_by_category": expense_by_category,
        "saving_rate": saving_rate
    }

def format_currency(amount):
    """Format an amount as currency"""
    return f"${amount:,.2f}"

def calculate_financial_health_score(budget_summary, savings_goals, investment_progress):
    """
    Calculate a financial health score based on user's financial data
    
    Returns a score from 0-100 and recommendations
    """
    score = 0
    recommendations = []
    
    # Check if we have budget data
    if not budget_summary:
        return {
            "score": 0,
            "recommendations": ["Please complete your budget to get a financial health score."]
        }
    
    # Budget balance (30 points max)
    balance_ratio = budget_summary["balance"] / max(budget_summary["total_income"], 1)
    if balance_ratio >= 0.2:  # Saving at least 20% of income
        score += 30
    elif balance_ratio > 0:
        score += 15 + (balance_ratio / 0.2) * 15
    else:
        score += 0
        recommendations.append("Your expenses exceed your income. Try to reduce expenses or increase income.")
    
    # Saving goals (25 points max)
    if savings_goals:
        active_goals = sum(1 for goal in savings_goals if goal.get("active", False))
        completed_goals = sum(1 for goal in savings_goals if goal.get("completed", False))
        
        if active_goals > 0:
            score += 15
        if completed_goals > 0:
            score += 10
    else:
        recommendations.append("Set up savings goals to improve your financial health.")
    
    # Expense diversity (15 points max)
    if len(budget_summary.get("expense_by_category", {})) >= 5:
        score += 15
    else:
        score += len(budget_summary.get("expense_by_category", {})) * 3
    
    # Investment knowledge (30 points max)
    if investment_progress:
        lessons_score = min(15, investment_progress.get("lessons_completed", 0) * 5)
        quiz_score = min(15, investment_progress.get("quizzes_taken", 0) * 5)
        score += lessons_score + quiz_score
    else:
        recommendations.append("Learn about investing to boost your financial literacy.")
    
    # Round the score
    final_score = round(score)
    
    # Generate recommendations based on score
    if not recommendations:
        if final_score < 30:
            recommendations.append("Focus on building an emergency fund and tracking expenses.")
        elif final_score < 60:
            recommendations.append("Consider paying down high-interest debt and increasing your savings rate.")
        elif final_score < 90:
            recommendations.append("Look into diversifying your investments and optimizing your budget.")
        else:
            recommendations.append("Great job! Consider increasing retirement contributions or exploring advanced investment strategies.")
    
    return {
        "score": final_score,
        "recommendations": recommendations
    }
