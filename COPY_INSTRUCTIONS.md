# Instructions to Complete ABC Motors Inventory Report

## Quick Setup Using Git (RECOMMENDED)

To efficiently copy all remaining src files from the reference repo, run these commands locally:

```bash
# Clone both repos
git clone https://github.com/mpalmer79/chevyinventory.git temp-chevy
git clone https://github.com/mpalmer79/ABC-Motors-inventory-report.git

cd ABC-Motors-inventory-report

# Copy all src folder contents (fix the double src/src issue)
cp -r ../temp-chevy/src/* ./src/

# OR if src/src exists, clean it up first:
rm -rf src/src
cp -r ../temp-chevy/src ./

# Copy other config files
cp ../temp-chevy/.eslintrc.cjs ./
cp ../temp-chevy/.prettierrc ./
cp ../temp-chevy/vite.config.js ./
cp ../temp-chevy/tailwind.config.js ./
cp ../temp-chevy/tsconfig.node.json ./
cp ../temp-chevy/netlify.toml ./

# Stage and commit
git add .
git commit -m "Copy complete src folder and config files from Chevrolet reference repo"
git push origin main

# Clean up
cd ..
rm -rf temp-chevy ABC-Motors-inventory-report
```

## Contents to be Copied

The ABC Motors repo needs the following from chevyinventory:

### Source Code Folders:
- src/components/ (all React components)
- - src/context/ (theme and other contexts)
  - - src/hooks/ (custom hooks like useInventoryLoader)
    - - src/lib/ (utility functions)
      - - src/store/ (Zustand store management)
        - - src/styles/ (CSS and theming)
          - - src/test/ (test setup files)
            - - src/utils/ (utility functions)
             
              - ### Source Files:
              - - src/index.jsx
                - - src/index.css
                  - - src/types.ts
                    - - src/inventoryHelpers.ts
                      - - src/inventoryHelpers.test.ts
                       
                        - ### Configuration Files:
                        - - .eslintrc.cjs
                          - - .prettierrc
                            - - vite.config.js
                              - - tailwind.config.js
                                - - tsconfig.node.json
                                  - - netlify.toml
                                   
                                    - ## Status
                                   
                                    - ✅ Created: ABC-Motors-inventory-report repo
                                    - ✅ Created: README.md, LICENSE, package.json
                                    - ✅ Created: index.html, tsconfig.json, .gitignore
                                    - ✅ Created: public/abc-motors-logo.svg (custom logo)
                                    - ✅ Created: src/App.tsx (core application entry)
                                   
                                    - ⏳ Pending: All other src files (use Git instructions above for efficiency)
