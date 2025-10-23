# Dependency Update Plan - 2025-10-23

**Date**: 2025-10-23
**Current Node Version**: 22.x
**Project**: Brennan Moore Personal Homepage/Blog

---

## Summary

Found **6 packages** with available updates:
- **3 major version updates** (Next.js 15→16, react-syntax-highlighter 15→16, eslint-config-next 15→16)
- **3 minor/patch updates** (Vitest ecosystem: 4.0.1→4.0.2)

---

## Package Update Analysis

### 🔴 Major Version Updates (Breaking Changes Likely)

#### 1. Next.js: 15.5.6 → 16.0.0

**Risk Level**: 🔴 **HIGH**
**Type**: Major version (Breaking changes expected)
**Affected Files**: Many (core framework)

**Known Breaking Changes** (Next.js 16):
- React 19 required (✅ already on 19.2.0)
- New caching behavior changes
- Middleware API updates
- Possible Image component changes
- App Router improvements/changes

**Impact Assessment**:
- **High Impact**: Core framework upgrade affects entire application
- **Test Coverage**: 75.64% - Good coverage to catch regressions
- **Build Time**: Expected to be compatible with current setup

**Recommendation**: ⚠️ **WAIT** - Monitor for stability
- Next.js 16.0.0 is very new (likely just released)
- Wait for 16.0.1 or 16.1.0 for bug fixes
- Check community feedback and migration guides
- Current 15.5.6 is stable and working well

**Action**: Monitor Next.js release notes, plan migration for 16.0.1+

---

#### 2. react-syntax-highlighter: 15.6.6 → 16.0.0

**Risk Level**: 🟡 **MEDIUM**
**Type**: Major version (Breaking changes possible)
**Affected Files**: [src/components/mdx-component.tsx](../src/components/mdx-component.tsx:12-37)

**Known Issues**:
- Contains prismjs vulnerability (moderate severity, build-time only)
- Major version bump suggests API changes
- Used only for code syntax highlighting in blog posts

**Impact Assessment**:
- **Medium Impact**: Only affects code blocks in blog posts
- **Test Coverage**: MDX component at 12.5% coverage (low)
- **Fallback**: Could switch to alternative like `shiki` if needed

**Recommendation**: ⚠️ **WAIT** - Research first
- Check changelog for breaking changes
- Verify prismjs vulnerability is fixed
- Consider alternative highlighters (`shiki`, `highlight.js`)
- Test thoroughly before updating

**Action**: Research v16 changes and prismjs vulnerability status

---

#### 3. eslint-config-next: 15.5.6 → 16.0.0

**Risk Level**: 🟢 **LOW**
**Type**: Major version (Tied to Next.js version)
**Affected Files**: ESLint configuration

**Known Details**:
- Typically matches Next.js version
- May add new linting rules
- Usually non-breaking for application code

**Impact Assessment**:
- **Low Impact**: Linting rules only, doesn't affect runtime
- **Test Coverage**: N/A (dev-time only)
- **Rollback**: Easy to revert

**Recommendation**: ⚠️ **WAIT** - Update with Next.js
- Update together with Next.js 16
- Check for new linting errors first
- May require code style adjustments

**Action**: Update when Next.js 16 is stable

---

### 🟢 Minor/Patch Updates (Low Risk)

#### 4. vitest: 4.0.1 → 4.0.2

**Risk Level**: 🟢 **LOW**
**Type**: Patch version (Bug fixes only)
**Affected Files**: Test infrastructure

**Details**:
- Patch version = bug fixes and minor improvements
- No breaking changes expected
- Currently have 221 passing tests

**Impact Assessment**:
- **Very Low Impact**: Test runner improvements
- **Test Coverage**: All 221 tests passing
- **Rollback**: Easy to revert

**Recommendation**: ✅ **UPDATE NOW** - Safe patch update
- Patch versions are typically safe
- May include test runner performance improvements
- Low risk of breaking changes

**Action**: Update immediately

---

#### 5. @vitest/coverage-istanbul: 4.0.1 → 4.0.2

**Risk Level**: 🟢 **LOW**
**Type**: Patch version (Bug fixes only)
**Affected Files**: Test coverage reporting

**Details**:
- Matches vitest version
- Coverage reporting only
- No impact on application code

**Impact Assessment**:
- **Very Low Impact**: Coverage tooling only
- **Test Coverage**: 75.64% currently
- **Rollback**: Easy to revert

**Recommendation**: ✅ **UPDATE NOW** - Safe patch update
- Update with vitest
- No breaking changes expected

**Action**: Update with vitest

---

#### 6. @vitest/ui: 4.0.1 → 4.0.2

**Risk Level**: 🟢 **LOW**
**Type**: Patch version (Bug fixes only)
**Affected Files**: Vitest UI dashboard

**Details**:
- Matches vitest version
- UI improvements only
- No impact on test execution

**Impact Assessment**:
- **Very Low Impact**: UI tooling only
- **Test Coverage**: N/A (dev tool)
- **Rollback**: Easy to revert

**Recommendation**: ✅ **UPDATE NOW** - Safe patch update
- Update with vitest
- May improve test UI experience

**Action**: Update with vitest

---

## Update Plan

### Phase 1: Safe Patch Updates (Immediate) ✅

**Packages**:
- vitest: 4.0.1 → 4.0.2
- @vitest/coverage-istanbul: 4.0.1 → 4.0.2
- @vitest/ui: 4.0.1 → 4.0.2

**Risk**: Very Low
**Time Estimate**: 10 minutes
**Testing Required**: Run test suite

**Steps**:
```bash
# Update Vitest ecosystem
npm install --save-dev vitest@4.0.2 @vitest/coverage-istanbul@4.0.2 @vitest/ui@4.0.2

# Verify tests still pass
npm test

# Verify coverage still works
npm run test:coverage

# Verify TypeScript compilation
npm run typecheck

# Verify production build
npm run build
```

**Rollback Plan**:
```bash
npm install --save-dev vitest@4.0.1 @vitest/coverage-istanbul@4.0.1 @vitest/ui@4.0.1
```

---

### Phase 2: Major Updates - Next.js 16 (Future)

**Timeline**: Wait 2-4 weeks for stability

**Pre-Update Research**:
1. Read Next.js 16 migration guide
2. Check breaking changes documentation
3. Review community feedback on GitHub/Reddit
4. Test in a branch first

**Packages**:
- next: 15.5.6 → 16.0.0
- eslint-config-next: 15.5.6 → 16.0.0

**Steps**:
```bash
# Create feature branch
git checkout -b upgrade/nextjs-16

# Update packages
npm install next@16.0.0 eslint-config-next@16.0.0

# Run full test suite
npm test
npm run test:coverage

# Check for lint errors
npm run lint

# TypeScript check
npm run typecheck

# Test build
npm run build

# Manual testing
npm start
# Test all pages manually
```

**Testing Checklist**:
- [ ] All 221 tests pass
- [ ] No TypeScript errors
- [ ] Production build succeeds
- [ ] All pages render correctly
- [ ] Image optimization still works
- [ ] RSS/JSON feed generation works
- [ ] Sitemap generation works
- [ ] No console errors in browser
- [ ] Performance metrics maintained

**Expected Issues**:
- Caching behavior changes
- Middleware updates (if using)
- Image component props changes
- New ESLint rules to fix

---

### Phase 3: react-syntax-highlighter Update (Future)

**Timeline**: After evaluating alternatives

**Pre-Update Research**:
1. Check react-syntax-highlighter v16 changelog
2. Verify prismjs vulnerability status
3. Research alternatives:
   - `shiki` - Fast, accurate, modern
   - `highlight.js` - Popular, lightweight
   - `prism-react-renderer` - More control

**Decision Points**:
- If v16 fixes prismjs vulnerability → Update
- If v16 has breaking changes → Evaluate alternatives
- If vulnerability persists → Switch to `shiki`

**Migration to shiki (if needed)**:
```bash
# Install shiki
npm install shiki

# Update MDX component to use shiki
# Simpler API, better performance, no vulnerabilities
```

**Shiki Benefits**:
- No security vulnerabilities
- Faster than PrismJS
- Better syntax highlighting accuracy
- Smaller bundle size
- Active maintenance

---

## Risk Assessment Matrix

| Package | Current | Latest | Risk | Impact | Urgency | Recommendation |
|---------|---------|--------|------|--------|---------|----------------|
| vitest | 4.0.1 | 4.0.2 | 🟢 Low | Very Low | Low | ✅ Update Now |
| @vitest/coverage-istanbul | 4.0.1 | 4.0.2 | 🟢 Low | Very Low | Low | ✅ Update Now |
| @vitest/ui | 4.0.1 | 4.0.2 | 🟢 Low | Very Low | Low | ✅ Update Now |
| next | 15.5.6 | 16.0.0 | 🔴 High | High | Low | ⚠️ Wait 2-4 weeks |
| eslint-config-next | 15.5.6 | 16.0.0 | 🟢 Low | Low | Low | ⚠️ Update with Next.js |
| react-syntax-highlighter | 15.6.6 | 16.0.0 | 🟡 Medium | Medium | Medium | ⚠️ Research alternatives |

---

## Recommended Actions

### Immediate (Today)

1. ✅ **Update Vitest ecosystem** (Phase 1)
   - Patch versions are safe
   - Improves test tooling
   - 10 minutes to update and verify

### This Week

2. ⚠️ **Research react-syntax-highlighter v16**
   - Check changelog for breaking changes
   - Verify prismjs vulnerability status
   - Evaluate `shiki` as alternative
   - Create issue/task for migration

### This Month

3. ⏳ **Monitor Next.js 16 stability**
   - Watch for 16.0.1 or 16.1.0 release
   - Read migration guides
   - Check community feedback
   - Plan migration timing (not urgent)

---

## Security Considerations

### Current Vulnerabilities

**react-syntax-highlighter → prismjs**:
- **Severity**: Moderate
- **Type**: Build-time only (not runtime)
- **Exploitability**: Low (requires build-time injection)
- **Status**: Accepted risk, monitoring for fix

**Recommendation**:
- Monitor for prismjs fix in react-syntax-highlighter v16
- Consider migration to `shiki` if issue persists
- Not urgent (build-time only, controlled environment)

---

## Testing Strategy

### Automated Testing
```bash
# After any updates
npm test                    # Run all 221 tests
npm run test:coverage       # Verify 75.64% coverage maintained
npm run typecheck           # TypeScript validation
npm run lint               # Code quality checks
npm run build              # Production build verification
```

### Manual Testing Checklist
- [ ] Homepage loads correctly
- [ ] Photo gallery displays images
- [ ] Blog posts render properly
- [ ] Code blocks syntax highlight correctly
- [ ] RSS feed generates
- [ ] JSON feed generates
- [ ] Sitemap generates
- [ ] Image optimization works
- [ ] No console errors
- [ ] Performance maintained

---

## Rollback Strategy

### For Patch Updates (Phase 1)
```bash
# Quick rollback - restore package.json and reinstall
git checkout package.json package-lock.json
npm install
```

### For Major Updates (Phase 2/3)
```bash
# Rollback from feature branch
git checkout main
npm install

# Or revert specific commit
git revert <commit-hash>
npm install
```

---

## Cost-Benefit Analysis

### Phase 1 (Vitest Updates)
| Factor | Value |
|--------|-------|
| **Risk** | Very Low |
| **Time** | 10 minutes |
| **Benefit** | Bug fixes, test improvements |
| **Urgency** | Low |
| **Recommendation** | ✅ Do Now |

### Phase 2 (Next.js 16)
| Factor | Value |
|--------|-------|
| **Risk** | High |
| **Time** | 2-4 hours |
| **Benefit** | New features, improvements |
| **Urgency** | Low (15.5.6 is stable) |
| **Recommendation** | ⏳ Wait for stability |

### Phase 3 (react-syntax-highlighter)
| Factor | Value |
|--------|-------|
| **Risk** | Medium |
| **Time** | 1-2 hours |
| **Benefit** | Security fix (if available) |
| **Urgency** | Medium |
| **Recommendation** | 🔍 Research first |

---

## Summary & Recommendation

### ✅ Do Now (Phase 1)
Update Vitest ecosystem (4.0.1 → 4.0.2):
- Very low risk
- Quick to implement
- Improves test tooling

### ⏳ Wait (Phase 2)
Next.js 16 and eslint-config-next:
- High risk (major version)
- Current version (15.5.6) is stable
- Wait 2-4 weeks for community feedback
- No urgent features needed

### 🔍 Research (Phase 3)
react-syntax-highlighter:
- Check v16 for prismjs fix
- Evaluate `shiki` as alternative
- Plan migration if needed
- Moderate urgency

### Overall Status
**Current state**: ✅ Healthy
- Only 6 packages outdated (out of 70+)
- All updates are manageable
- No critical security issues
- 75.64% test coverage provides safety net

**Next action**: Execute Phase 1 (Vitest updates) today

---

## References

- [Next.js 16 Release Notes](https://nextjs.org/blog) - Check when available
- [Vitest Changelog](https://github.com/vitest-dev/vitest/releases)
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [Shiki - Modern Syntax Highlighter](https://shiki.matsu.io/)

---

**Report Generated**: 2025-10-23
**Next Review**: 2025-11-06 (2 weeks)
**Status**: Ready for Phase 1 Execution
