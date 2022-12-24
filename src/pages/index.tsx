/* eslint-disable @next/next/no-html-link-for-pages */
import type { NextPage } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from '../styles/Home.module.css';

import MainLayout from '../components/layout/MainLayout/MainLayout';
import db, { CacheKeys } from '../lib';

import { wrapper } from '../store/store';
import { actions as liveryActions } from '../store/livery/slice';
import { actions as carActions } from '../store/car/slice';
import { actions as garageActions } from '../store/garage/slice';
import { actions as userActions } from '../store/user/slice';
import { parsePromiseSettledRes } from '../utils/functions';

const messages = defineMessages({
  welcome: {
    id: 'pages.index.welcome',
    defaultMessage: 'Welcome'
  }
});

const Home: NextPage = () => {
  return (
    <MainLayout pageDescription="The home of GP Sim Paddock! Come and find a livery or your next favourite setup here!">
      <main className={styles.main}>
        <h1 className={styles.title}>
          <FormattedMessage {...messages.welcome} /> to{' '}
          <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <a href="/api/auth/login">Login</a>
        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>
    </MainLayout>
  );
};

export default Home;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  const [_cars, _garages, _liveries, _users] = await Promise.allSettled([
    db.getCars(),
    db.getGarages(),
    db.getLiveries(),
    db.getUsers()
  ]);

  const cars = parsePromiseSettledRes(_cars);
  const garages = parsePromiseSettledRes(_garages);
  const liveries = parsePromiseSettledRes(_liveries);
  const users = parsePromiseSettledRes(_users);

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    if (cars) await db.cache.set(CacheKeys.CAR, cars);
    if (garages) await db.cache.set(CacheKeys.GARAGE, garages);
    if (liveries) await db.cache.set(CacheKeys.LIVERY, liveries);
    if (users) await db.cache.set(CacheKeys.USER, users);
  }

  if (cars) store.dispatch(carActions.setCars(cars));
  if (garages) store.dispatch(garageActions.setGarages(garages));
  if (liveries) store.dispatch(liveryActions.setLiveries(liveries));
  if (users) store.dispatch(userActions.setUsers(users));

  return {
    props: {}
  };
});
