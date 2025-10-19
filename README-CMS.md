# Netlify CMS Setup for Z Piekła do Domu

## Overview
This website now includes a fully functional Netlify CMS (Content Management System) that allows you to easily manage content without touching code.

## What's Included

### CMS Collections:
1. **Psy do adopcji** (`content/dogs/`) - Manage dog profiles for adoption
2. **Strony** (`content/pages/`) - Manage page content (home, about, etc.)
3. **Produkty** (`content/products/`) - Manage shop products
4. **Inicjatywy** (`content/initiatives/`) - Manage initiatives and projects
5. **Partnerzy** (`content/partners/`) - Manage partner information

### Files Created:
- `admin/config.yml` - CMS configuration
- `admin/index.html` - CMS admin interface
- Sample content files in `content/` directories

## How to Use

### 1. Deploy to Netlify
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect the repository to Netlify
3. Deploy the site

### 2. Enable Netlify Identity
1. In your Netlify dashboard, go to "Identity" tab
2. Enable Identity service
3. Configure registration settings (recommend invite-only for security)

### 3. Access the CMS
1. Visit `yoursite.com/admin/`
2. Sign up or log in using Netlify Identity
3. Start managing your content!

### 4. Enable Git Gateway (for editing)
1. In Netlify dashboard, go to "Identity" → "Settings and usage"
2. Enable "Git Gateway"
3. This allows authenticated users to edit content directly

## Content Management

### Adding New Dogs:
1. Go to "Psy do adopcji" in the CMS
2. Click "New Psy do adopcji"
3. Fill in all the fields (name, description, image, etc.)
4. Save and publish

### Managing Pages:
1. Go to "Strony" in the CMS
2. Edit existing pages or create new ones
3. Use markdown for rich text content

### Managing Products:
1. Go to "Produkty" in the CMS
2. Add new products with images and pricing
3. Set availability status

## Features

- **Image Management**: Upload and manage images directly in the CMS
- **Rich Text Editor**: Use markdown for formatted content
- **Preview Mode**: See changes before publishing
- **Version Control**: All changes are tracked in Git
- **Multi-user Support**: Multiple editors can work simultaneously

## Security Notes

- Only invited users can access the CMS
- All changes are tracked and can be reverted
- Images are stored in your repository
- No external dependencies for content storage

## Support

If you need help with the CMS:
1. Check Netlify's documentation: https://www.netlifycms.org/docs/
2. Review the configuration in `admin/config.yml`
3. Ensure all required fields are filled when creating content

## Next Steps

1. Deploy to Netlify
2. Set up Identity and Git Gateway
3. Invite content editors
4. Start managing your content!
