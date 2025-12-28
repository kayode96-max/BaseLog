# Contributing to BaseLog

Thank you for your interest in contributing to BaseLog! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Your environment (OS, browser, wallet)

### Suggesting Features

1. Check the roadmap and existing issues
2. Create a new issue tagged "enhancement"
3. Describe the feature and its benefits
4. Consider implementation details

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Follow the code style guidelines
5. Test your changes
6. Commit with clear messages
7. Push and create a PR

## Development Setup

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/baselog.git
cd baselog

# 2. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/baselog.git

# 3. Install dependencies
npm install
cd contracts && npm install && cd ..

# 4. Create .env files
cp .env.example .env
cp contracts/.env.example contracts/.env

# 5. Run development server
npm run dev
```

## Code Style

### TypeScript/React

- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript types (avoid `any`)
- Keep components small and focused
- Extract reusable logic into hooks

**Example:**
```typescript
// Good ✅
export function MyComponent({ data }: { data: string }) {
  const [state, setState] = useState<string>('');
  return <div>{data}</div>;
}

// Bad ❌
export function MyComponent(props: any) {
  let state = '';
  return <div>{props.data}</div>;
}
```

### Solidity

- Follow Solidity style guide
- Use NatSpec comments
- Keep functions simple
- Optimize for gas efficiency

**Example:**
```solidity
// Good ✅
/**
 * @notice Create a journal entry
 * @param txHash The transaction hash
 * @param _cid The IPFS CID
 */
function logEntry(bytes32 txHash, string memory _cid) external {
    require(bytes(_cid).length > 0, "CID cannot be empty");
    // ...
}

// Bad ❌
function logEntry(bytes32 txHash, string memory _cid) external {
    entries[msg.sender][txHash] = Entry(_cid, block.timestamp, msg.sender);
}
```

### File Naming

- Components: PascalCase (e.g., `TransactionCalendar.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useBaseTransactions.ts`)
- Utils: camelCase (e.g., `formatAddress.ts`)
- Constants: SCREAMING_SNAKE_CASE

## Testing

### Smart Contracts

```bash
cd contracts
npx hardhat test
```

Add tests for new contract functions:

```javascript
describe("JournalRegistry", function () {
  it("Should create a journal entry", async function () {
    // Test implementation
  });
});
```

### Frontend (Coming Soon)

```bash
npm run test
```

## Commit Messages

Use conventional commits:

```
feat: add export to CSV functionality
fix: resolve wallet connection issue
docs: update README with new features
style: format code with prettier
refactor: simplify calendar component
test: add tests for IPFS upload
chore: update dependencies
```

## Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

## Pull Request Process

1. **Update Documentation**: If you change APIs or add features
2. **Add Tests**: For new functionality
3. **Update CHANGELOG**: Add entry to [Unreleased] section
4. **Lint**: Run `npm run lint` before committing
5. **Screenshots**: Include for UI changes
6. **Description**: Explain what, why, and how

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
```

## Areas for Contribution

### 🟢 Good First Issues

- Add loading skeletons
- Improve error messages
- Add more transaction categories
- Improve mobile responsiveness

### 🟡 Intermediate

- Add search functionality
- Implement CSV export
- Add transaction filters
- Create analytics dashboard

### 🔴 Advanced

- Integrate The Graph for indexing
- Add AI-powered categorization
- Implement multisig wallet support
- Build PWA features

## Questions?

- Open a GitHub Discussion
- Join our Discord (coming soon)
- Email: contact@baselog.app

---

Thank you for contributing! 🙏
