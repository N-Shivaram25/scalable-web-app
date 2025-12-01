# 🚀 Quick Deployment Checklist

Use this checklist before deploying to Vercel.

## ✅ Local Testing (Before Pushing)

- [ ] Frontend builds without errors: `npm run build` (in frontend folder)
- [ ] Backend starts without errors: `npm start` (in backend folder)
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can view dashboard
- [ ] Can create a project
- [ ] Can edit a project
- [ ] Can delete a project
- [ ] Profile page loads correctly
- [ ] Profile modal opens and works
- [ ] Settings page accessible
- [ ] Theme toggle works
- [ ] Sidebar collapse/expand works
- [ ] Responsive design works on mobile

## 📋 MongoDB Atlas Setup

- [ ] MongoDB Atlas account created
- [ ] Cluster created (Free tier is fine)
- [ ] Database user created with username and password
- [ ] Connection string copied (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
- [ ] IP whitelist updated to allow Vercel access (0.0.0.0/0)

## 🔐 Security Setup

- [ ] Generate strong JWT_SECRET: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] MongoDB connection string secured
- [ ] All sensitive data removed from code

## 📦 Repository Setup

- [ ] Code committed to GitHub: `git push origin main`
- [ ] No node_modules in repository (check .gitignore)
- [ ] All environment variables removed from code
- [ ] vercel.json file is in root directory
- [ ] package.json exists in both backend and frontend folders

## 🌐 Vercel Setup

- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Project imported from GitHub
- [ ] Environment variables added:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV` = production
  - [ ] `FRONTEND_URL` = your-project.vercel.app
- [ ] Build settings configured correctly
- [ ] Deployment initiated

## ✨ Post-Deployment Testing

- [ ] App loads at https://your-project-name.vercel.app
- [ ] Frontend renders correctly
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Dashboard loads with data
- [ ] API health check: `curl https://your-project.vercel.app/api/health`
- [ ] Projects can be created/edited/deleted
- [ ] Profile page works
- [ ] Images upload correctly
- [ ] Dark mode works
- [ ] All pages responsive on mobile

## 📊 Performance Checks

- [ ] Page loads within acceptable time
- [ ] No console errors
- [ ] No console warnings
- [ ] Network requests complete successfully
- [ ] Database queries return results

## 📝 Documentation

- [ ] README.md updated with deployment URL
- [ ] VERCEL_DEPLOYMENT_GUIDE.md reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented

## 🎉 Final Steps

- [ ] Share deployment URL with stakeholders
- [ ] Set up custom domain (optional)
- [ ] Enable analytics (Vercel Pro)
- [ ] Set up monitoring and alerts
- [ ] Create backup of MongoDB data

---

**Status**: ⏳ Ready for deployment

**Deployment Date**: _________________

**Deployed URL**: _________________

**Notes**: 
_________________________________________________________________
_________________________________________________________________
