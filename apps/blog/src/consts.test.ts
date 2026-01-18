import { describe, it, expect } from 'vitest';
import { SITE_TITLE, SITE_DESCRIPTION } from './consts';

describe('consts', () => {
  describe('SITE_TITLE', () => {
    it('should be defined', () => {
      expect(SITE_TITLE).toBeDefined();
    });

    it('should be "Fractals of Change"', () => {
      expect(SITE_TITLE).toBe('Fractals of Change');
    });

    it('should be a non-empty string', () => {
      expect(typeof SITE_TITLE).toBe('string');
      expect(SITE_TITLE.length).toBeGreaterThan(0);
    });
  });

  describe('SITE_DESCRIPTION', () => {
    it('should be defined', () => {
      expect(SITE_DESCRIPTION).toBeDefined();
    });

    it('should be a non-empty string', () => {
      expect(typeof SITE_DESCRIPTION).toBe('string');
      expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
    });

    it('should contain relevant keywords', () => {
      expect(SITE_DESCRIPTION.toLowerCase()).toContain('transformation');
      expect(SITE_DESCRIPTION.toLowerCase()).toContain('organization');
    });
  });
});
