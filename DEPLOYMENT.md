# AllerChef Vercel Deployment Guide

## **Pre-Deployment Checklist**

### **1. Environment Variables Setup**
You need to configure these environment variables in Vercel:

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/allerchef?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Spoonacular API Key
SPOONACULAR_API_KEY=your-spoonacular-api-key-here

# NewsData.io API Key
NEWSDATA_API_KEY=your-newsdata-api-key-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **2. API Keys Required**
- **Spoonacular API**: Get from [spoonacular.com/food-api](https://spoonacular.com/food-api)
- **NewsData.io API**: Get from [newsdata.io](https://newsdata.io)
- **MongoDB Atlas**: Create cluster at [mongodb.com](https://mongodb.com)

## **Deployment Steps**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```

### **Step 3: Deploy to Vercel**
```bash
vercel
```

### **Step 4: Configure Environment Variables**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the environment variables listed above

### **Step 5: Redeploy with Environment Variables**
```bash
vercel --prod
```

## **API Endpoints**

Your app will have these API endpoints:

- `GET /api/news` - Get health news articles
- `GET /api/news/fetch` - Fetch fresh articles from NewsData.io
- `GET /api/recipes` - Get recipes
- `GET /api/recipes/search` - Search recipes
- `GET /api/recipes/allergy-safe` - Get allergy-safe recipes
- `GET /api/recipes/:id` - Get specific recipe
- `POST /api/auth` - Authentication (login/register)

## **Frontend Routes**

- `/` - Home page
- `/recipes` - Recipe search and listing
- `/blogs` - Health news articles
- `/dieticians` - Dietician listings
- `/saved` - Saved recipes (requires login)
- `/auth` - Authentication page

## **Important Notes**

1. **MongoDB Atlas**: Make sure your MongoDB cluster allows connections from anywhere (0.0.0.0/0)
2. **API Limits**: Monitor your Spoonacular and NewsData.io API usage
3. **CORS**: CORS is configured to allow all origins for development
4. **Caching**: News articles are cached for 30 minutes to avoid API rate limits

## **Troubleshooting**

### **Common Issues:**

1. **Environment Variables Not Working**
   - Make sure all variables are set in Vercel dashboard
   - Redeploy after adding environment variables

2. **MongoDB Connection Issues**
   - Check your MongoDB Atlas connection string
   - Ensure IP whitelist includes Vercel's IPs

3. **API Rate Limits**
   - Monitor your API usage
   - Implement caching if needed

4. **Build Errors**
   - Check TypeScript compilation
   - Ensure all dependencies are in package.json

## **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB connection

## **Success!**

Once deployed, your AllerChef app will be live at:
`https://your-project-name.vercel.app` 