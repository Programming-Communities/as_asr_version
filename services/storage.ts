export class StorageService {
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private isSessionStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  setLocal<T>(key: string, value: T): void {
    if (!this.isLocalStorageAvailable()) return;
    
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(`al-asr_${key}`, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getLocal<T>(key: string, defaultValue: T): T {
    if (!this.isLocalStorageAvailable()) return defaultValue;
    
    try {
      const item = localStorage.getItem(`al-asr_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  removeLocal(key: string): void {
    if (!this.isLocalStorageAvailable()) return;
    
    try {
      localStorage.removeItem(`al-asr_${key}`);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  setSession(key: string, value: any): void {
    if (!this.isSessionStorageAvailable()) return;
    
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(`al-asr_${key}`, serialized);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  getSession<T>(key: string, defaultValue?: T): T | null {
    if (!this.isSessionStorageAvailable()) return defaultValue || null;
    
    try {
      const item = sessionStorage.getItem(`al-asr_${key}`);
      return item ? JSON.parse(item) : (defaultValue || null);
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue || null;
    }
  }

  removeSession(key: string): void {
    if (!this.isSessionStorageAvailable()) return;
    
    try {
      sessionStorage.removeItem(`al-asr_${key}`);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }

  // Cookie methods
  setCookie(name: string, value: string, days: number): void {
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `al-asr_${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }

  getCookie(name: string): string | null {
    try {
      const nameEQ = `al-asr_${name}=`;
      const ca = document.cookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length));
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }

  removeCookie(name: string): void {
    try {
      document.cookie = `al-asr_${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  }

  // Bookmark methods
  saveBookmark(postId: number, postData: any): void {
    const bookmarks = this.getLocal<Record<number, any>>('bookmarks', {});
    const updatedBookmarks = { ...bookmarks, [postId]: {
      ...postData,
      savedAt: new Date().toISOString(),
    }};
    this.setLocal('bookmarks', updatedBookmarks);
  }

  removeBookmark(postId: number): void {
    const bookmarks = this.getLocal<Record<number, any>>('bookmarks', {});
    const { [postId]: removed, ...remaining } = bookmarks;
    this.setLocal('bookmarks', remaining);
  }

  getBookmarks(): Record<number, any> {
    return this.getLocal<Record<number, any>>('bookmarks', {});
  }

  isBookmarked(postId: number): boolean {
    const bookmarks = this.getBookmarks();
    return !!bookmarks[postId];
  }

  // Reading history
  addToHistory(postId: number, postData: any): void {
    const history = this.getLocal<Array<any>>('reading_history', []);
    
    // Filter out existing entry
    const filtered = history.filter(item => item.id !== postId);
    
    // Add to beginning
    const updatedHistory = [{
      id: postId,
      ...postData,
      lastRead: new Date().toISOString(),
    }, ...filtered];
    
    // Keep only last 50 items
    this.setLocal('reading_history', updatedHistory.slice(0, 50));
  }

  getHistory(): Array<any> {
    return this.getLocal<Array<any>>('reading_history', []);
  }

  // Theme preference
  setTheme(theme: string): void {
    this.setLocal('theme', theme);
  }

 getTheme(): string | null {
  const theme = this.getLocal<string | null>('theme', null);
  return theme;
}

  // Cookie preferences
  setCookiePreferences(preferences: any): void {
    this.setLocal('cookie_preferences', {
      ...preferences,
      timestamp: Date.now(),
    });
  }

  getCookiePreferences(): any {
    return this.getLocal('cookie_preferences', null);
  }
}

export const storageService = new StorageService();
export default storageService;