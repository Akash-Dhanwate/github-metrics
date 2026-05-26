#!/bin/bash

# ============================================
# GitHubMetrics Project Structure Generator
# ============================================

echo "🚀 Creating GitHubMetrics Full-Stack Structure..."
# ============================================
# FRONTEND STRUCTURE
# ============================================

mkdir -p frontend/src/{components,pages,hooks,context,services,utils,styles}
mkdir -p frontend/src/components/{common,profile,charts,search,comparison}
mkdir -p frontend/public

# Frontend root files
touch frontend/package.json
touch frontend/vite.config.js
touch frontend/tailwind.config.js
touch frontend/postcss.config.js
touch frontend/.gitignore
touch frontend/.env.example
touch frontend/README.md

# Frontend source files
touch frontend/src/App.jsx
touch frontend/src/main.jsx
touch frontend/src/Router.jsx

# Styles
touch frontend/src/styles/App.css
touch frontend/src/styles/index.css
touch frontend/src/styles/variables.css

# Components - Common
touch frontend/src/components/common/Header.jsx
touch frontend/src/components/common/Footer.jsx
touch frontend/src/components/common/LoadingSpinner.jsx
touch frontend/src/components/common/ErrorBoundary.jsx
touch frontend/src/components/common/ThemeToggle.jsx

# Components - Profile
touch frontend/src/components/profile/ProfileCard.jsx
touch frontend/src/components/profile/UserInfo.jsx
touch frontend/src/components/profile/QuickStats.jsx
touch frontend/src/components/profile/RepositoriesTable.jsx
touch frontend/src/components/profile/RepoRow.jsx

# Components - Charts
touch frontend/src/components/charts/LanguagePieChart.jsx
touch frontend/src/components/charts/ContributionHeatmap.jsx
touch frontend/src/components/charts/RepositoryStatsChart.jsx
touch frontend/src/components/charts/ComparisonBarChart.jsx

# Components - Search
touch frontend/src/components/search/SearchBar.jsx
touch frontend/src/components/search/SearchResults.jsx
touch frontend/src/components/search/SearchHistory.jsx

# Components - Comparison
touch frontend/src/components/comparison/ComparisonSelector.jsx
touch frontend/src/components/comparison/ComparisonTable.jsx
touch frontend/src/components/comparison/ComparisonCharts.jsx

# Pages
touch frontend/src/pages/HomePage.jsx
touch frontend/src/pages/ProfilePage.jsx
touch frontend/src/pages/ComparePage.jsx
touch frontend/src/pages/DashboardPage.jsx
touch frontend/src/pages/LoginPage.jsx
touch frontend/src/pages/NotFoundPage.jsx

# Hooks
touch frontend/src/hooks/useAuth.js
touch frontend/src/hooks/useFetch.js
touch frontend/src/hooks/useLocalStorage.js
touch frontend/src/hooks/useDebounce.js

# Context
touch frontend/src/context/AuthContext.jsx
touch frontend/src/context/ThemeContext.jsx
touch frontend/src/context/NotificationContext.jsx

# Services
touch frontend/src/services/api.js
touch frontend/src/services/userService.js
touch frontend/src/services/compareService.js
touch frontend/src/services/trendingService.js
touch frontend/src/services/authService.js

# Utils
touch frontend/src/utils/formatters.js
touch frontend/src/utils/validators.js
touch frontend/src/utils/helpers.js
touch frontend/src/utils/constants.js

# ============================================
# BACKEND STRUCTURE
# ============================================

mkdir -p backend/app/{api,services,models,schemas,middleware}
mkdir -p backend/app/api/v1
mkdir -p backend/database/migrations/versions
mkdir -p backend/cache
mkdir -p backend/logs
mkdir -p backend/tests/fixtures

# Backend root files
touch backend/.env
touch backend/.env.example
touch backend/.gitignore
touch backend/requirements.txt
touch backend/Dockerfile
touch backend/docker-compose.yml
touch backend/README.md

# Backend main files
touch backend/app/main.py
touch backend/app/config.py
touch backend/app/dependencies.py
touch backend/app/exceptions.py
touch backend/app/utils.py

# API files
touch backend/app/api/__init__.py
touch backend/app/api/router.py

touch backend/app/api/v1/__init__.py
touch backend/app/api/v1/users.py
touch backend/app/api/v1/compare.py
touch backend/app/api/v1/trending.py
touch backend/app/api/v1/auth.py
touch backend/app/api/v1/analytics.py
touch backend/app/api/v1/health.py

# Services
touch backend/app/services/__init__.py
touch backend/app/services/github_service.py
touch backend/app/services/cache_service.py
touch backend/app/services/database_service.py
touch backend/app/services/auth_service.py
touch backend/app/services/analytics_service.py

# Models
touch backend/app/models/__init__.py
touch backend/app/models/base.py
touch backend/app/models/user.py
touch backend/app/models/profile.py
touch backend/app/models/comparison.py

# Schemas
touch backend/app/schemas/__init__.py
touch backend/app/schemas/user.py
touch backend/app/schemas/profile.py
touch backend/app/schemas/comparison.py
touch backend/app/schemas/error.py

# Middleware
touch backend/app/middleware/__init__.py
touch backend/app/middleware/error_handler.py
touch backend/app/middleware/logging.py

# Database
touch backend/database/__init__.py
touch backend/database/base.py
touch backend/database/session.py

touch backend/database/migrations/env.py
touch backend/database/migrations/script.py.mako
touch backend/database/migrations/alembic.ini

# Cache
touch backend/cache/__init__.py
touch backend/cache/redis.py

# Tests
touch backend/tests/__init__.py
touch backend/tests/conftest.py
touch backend/tests/test_users.py
touch backend/tests/test_compare.py
touch backend/tests/test_cache.py
touch backend/tests/fixtures/sample_data.py

# Logs
touch backend/logs/app.log

# ============================================
# DOCS
# ============================================

mkdir -p docs

touch docs/ARCHITECTURE.md
touch docs/API_DOCUMENTATION.md
touch docs/SETUP_GUIDE.md
touch docs/DEVELOPMENT.md
touch docs/DEPLOYMENT.md

# ============================================
# GITHUB WORKFLOWS
# ============================================

mkdir -p .github/workflows

touch .github/workflows/tests.yml
touch .github/workflows/deploy.yml
touch .github/workflows/lint.yml

# ============================================
# ROOT FILES
# ============================================

touch CONTRIBUTING.md
touch .gitignore
touch docker-compose.yml

# ============================================
# SUCCESS MESSAGE
# ============================================

echo "✅ GitHubMetrics folder structure created successfully!"
echo ""
echo "📦 Project Ready:"
echo "   ├── frontend/"
echo "   ├── backend/"
echo "   ├── docs/"
echo "   ├── .github/"
echo "   └── deployment files"
echo ""
echo "🔥 Next Steps:"
echo "1. cd github-metrics"
echo "2. Open in VS Code"
echo "3. Initialize Git:"
echo "   git init"
echo "4. Start frontend/backend setup"
echo ""
echo "🚀 Happy Building!"
