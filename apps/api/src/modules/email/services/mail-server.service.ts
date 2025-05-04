import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class MailServerService {
  browser: Browser;
  isLoggedIn = false;

  constructor() {
    this.loadCookies();
  }

  async loadCookies() {
    this.browser = await puppeteer.launch({
      headless: false,
    });

    const page = await this.browser.newPage();

    console.log('Browser started');

    const loginUrl = `${process.env.MAIL_SERVER_URL}/login?return_to=%2F`;

    console.log('Navigating to', loginUrl);

    await page.goto(loginUrl);

    const emailPointer = 'input[type="email"]';
    const passwordPointer = 'input[type="password"]';

    await page.waitForSelector(emailPointer);

    await page.type(emailPointer, process.env.MAIL_SERVER_EMAIL);

    await page.type(passwordPointer, process.env.MAIL_SERVER_PASSWORD);

    console.log('Typed email and password');

    await page.click('input[type="submit"]');

    await page.waitForNavigation();

    console.log('Logged in');

    await page.waitForSelector('a[data-remember="yes"]');

    console.log('Found remember buttons');

    await page.click('a[data-remember="yes"]');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Clicked remember buttons');

    await page.close();

    this.isLoggedIn = true;
  }

  async getDomainDetails(page: Page) {
    await page.waitForSelector('.codeBlock');

    const domainId = await page.evaluate(() => {
      const url = window.location.href;
      const match = url.match(/\/domains\/([^\/]+)/);
      return match ? match[1] : '';
    });

    const spfStatus = await page.evaluate(() => {
      const spfSection = Array.from(document.querySelectorAll('h3')).find(
        (el) => el.textContent?.includes('SPF Record'),
      )?.nextElementSibling;
      const statusElement = spfSection?.querySelector('.label');
      return statusElement?.textContent?.trim() || 'Unknown';
    });

    const spfRecord = await page.evaluate(() => {
      const codeBlock = document.querySelectorAll('.codeBlock')[0];
      return codeBlock?.textContent?.trim() || '';
    });

    const dkimStatus = await page.evaluate(() => {
      const dkimSection = Array.from(document.querySelectorAll('h3')).find(
        (el) => el.textContent?.includes('DKIM Record'),
      )?.nextElementSibling;
      const statusElement = dkimSection?.querySelector('.label');
      return statusElement?.textContent?.trim() || 'Unknown';
    });

    const dkimRecord = await page.evaluate(() => {
      const codeBlock = document.querySelectorAll('.codeBlock')[1];
      return codeBlock?.textContent?.trim() || '';
    });

    const dkimName = await page.evaluate(() => {
      return document
        .querySelectorAll('.pageContent__text')[1]
        .querySelector('b')
        .innerText.trim();
    });

    return {
      domainId,
      spf: {
        name: '@',
        status: spfStatus.toLowerCase().trim(),
        record: spfRecord,
      },
      dkim: {
        name: dkimName,
        status: dkimStatus.toLowerCase().trim(),
        record: dkimRecord,
      },
    };
  }

  async createDomain(domainName: string) {
    if (!this.isLoggedIn) {
      throw new Error('Not logged in');
    }
    try {
      const page = await this.browser.newPage();

      const url = `${process.env.MAIL_SERVER_URL}/org/jsx-mail/servers/prod/domains/new`;

      console.log('Navigating to', url);

      const inputSelector = '#domain_name';

      await page.goto(url);

      await page.waitForSelector(inputSelector);

      await page.type(inputSelector, domainName);

      await page.click('input[type="submit"]');

      await page.waitForNavigation();

      const { domainId, spf, dkim } = await this.getDomainDetails(page);

      await page.close();

      return {
        domainId,
        spfRecord: spf,
        dkimRecord: dkim,
      };
    } catch (error) {
      console.error('Error creating domain', error);
      throw error;
    }
  }

  async verifyDomain(domainId: string) {
    const page = await this.browser.newPage();

    const url = `${process.env.MAIL_SERVER_URL}/org/jsx-mail/servers/prod/domains/${domainId}/setup`;

    await page.goto(url);

    await page.waitForSelector('.button');

    await page.click('.button');

    await page.waitForNavigation();

    const {
      domainId: newDomainId,
      spf,
      dkim,
    } = await this.getDomainDetails(page);

    await page.close();

    return {
      domainId: newDomainId,
      spf,
      dkim,
    };
  }

  async deleteDomain(domainId: string) {
    const page = await this.browser.newPage();

    const pathName = `/org/jsx-mail/servers/prod/domains/${domainId}`;

    const url = `${process.env.MAIL_SERVER_URL}/org/jsx-mail/servers/prod/domains`;

    await page.goto(url);

    await page.waitForSelector('.domainList__delete');

    const dialogPromise = new Promise<void>((resolve) => {
      page.on('dialog', (dialog) => {
        console.log('dialog', dialog);
        dialog.accept();
        resolve();
      });
    });

    await page.evaluate(async (pathName: string) => {
      const deleteButtons = document.querySelectorAll('.domainList__delete');
      const currentDomainButton: any = Array.from(deleteButtons).find(
        (button: any) => button.href.includes(pathName),
      );
      if (!currentDomainButton) {
        throw new Error('Domain not found');
      }

      await currentDomainButton.click();
    }, pathName);

    await dialogPromise;

    console.log('Clicked delete button');

    await page.waitForNavigation();

    await page.close();

    return true;
  }
}
