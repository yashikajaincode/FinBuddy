-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  badge_name VARCHAR(50) REFERENCES badges(name) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, badge_name)
);

-- Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_income DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_expenses DECIMAL(12, 2) NOT NULL DEFAULT 0,
  savings_target DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id)
);

-- Income Items Table
CREATE TABLE IF NOT EXISTS income_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expense Items Table
CREATE TABLE IF NOT EXISTS expense_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Other',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Savings Goals Table
CREATE TABLE IF NOT EXISTS savings_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  target_date DATE,
  category VARCHAR(50) NOT NULL DEFAULT 'General',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Savings Contributions Table
CREATE TABLE IF NOT EXISTS savings_contributions (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER REFERENCES savings_goals(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Tips Table
CREATE TABLE IF NOT EXISTS financial_tips (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investment Modules Table
CREATE TABLE IF NOT EXISTS investment_modules (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Completed Modules Table
CREATE TABLE IF NOT EXISTS user_completed_modules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES investment_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  quiz_score INTEGER,
  UNIQUE (user_id, module_id)
);

-- User Tips Viewed Table (for tracking tip view count)
CREATE TABLE IF NOT EXISTS user_tips_viewed (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tip_count INTEGER DEFAULT 0,
  last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id)
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Badges
INSERT INTO badges (name, description, emoji)
VALUES 
  ('Welcome', 'Welcome to FinBuddy! Your financial journey begins.', '🎉'),
  ('Budget Beginner', 'Created your first budget. A great start!', '📊'),
  ('Budget Master', 'Using advanced budget categories. Well organized!', '🏆'),
  ('Savings Pro', 'Saving at least 20% of your income. Impressive!', '💰'),
  ('Goal Setter', 'Set your first savings goal. Dream big!', '🎯'),
  ('Goal Achiever', 'Reached a savings goal. Keep it up!', '🏅'),
  ('Super Saver', 'Created three or more savings goals. Ambitious!', '🦸'),
  ('Savings Master', 'Completed all your savings goals. Amazing!', '👑'),
  ('Investment Student', 'Completed your first investment lesson. Learning!', '📚'),
  ('Investment Explorer', 'Completed three investment modules. Knowledge is power!', '🧠'),
  ('Investment Guru', 'Scored 80%+ on an investment quiz. Expert!', '🔮'),
  ('Tip Seeker', 'Viewed your first financial tip. Curious!', '💡'),
  ('Finance Guru', 'Viewed five or more financial tips. Dedicated!', '🧙'),
  ('Smart Shopper', 'Used the affordability calculator. Thoughtful spending!', '🛒')
ON CONFLICT DO NOTHING;

-- Seed Financial Tips
INSERT INTO financial_tips (title, content, category)
VALUES 
  ('50/30/20 Rule', 'Try budgeting with the 50/30/20 rule: 50% of income for needs, 30% for wants, and 20% for savings.', 'Budgeting'),
  ('Emergency Fund', 'Build an emergency fund covering 3-6 months of expenses before investing.', 'Saving'),
  ('Student Loan Options', 'Federal student loans typically offer more flexible repayment options than private loans.', 'Debt'),
  ('Credit Card Interest', 'Paying only the minimum on credit cards can double or triple the cost of purchases due to interest.', 'Credit'),
  ('Coffee Challenge', 'Try the coffee challenge: Skip buying coffee for a week and see how much you save.', 'Saving'),
  ('24-Hour Rule', 'Use the 24-hour rule: Wait a day before making any non-essential purchase over $50.', 'Spending'),
  ('Automatic Savings', 'Set up automatic transfers to savings on payday to make saving effortless.', 'Saving'),
  ('Compound Interest Magic', 'The magic of compound interest means $100 invested monthly at 7% can grow to over $120,000 in 30 years.', 'Investing'),
  ('Budget Categories', 'Try tracking unusual spending categories to find surprising savings opportunities.', 'Budgeting'),
  ('Subscription Audit', 'Review all your subscriptions every 3 months and cancel ones you no longer use.', 'Spending')
ON CONFLICT DO NOTHING;

-- Seed Investment Modules
INSERT INTO investment_modules (title, description, difficulty)
VALUES 
  ('Investment Basics', 'Learn fundamental investment concepts and terminology.', 'beginner'),
  ('Stock Market 101', 'Understand how the stock market works and how to start investing.', 'beginner'),
  ('Index Funds', 'Learn about index funds and why they are recommended for beginners.', 'beginner'),
  ('Risk and Return', 'Understand the relationship between risk and potential returns.', 'intermediate'),
  ('Retirement Accounts', 'Explore different retirement account options and their tax advantages.', 'beginner'),
  ('Risk and Diversification', 'Learn how to manage risk through proper portfolio diversification.', 'intermediate')
ON CONFLICT DO NOTHING;