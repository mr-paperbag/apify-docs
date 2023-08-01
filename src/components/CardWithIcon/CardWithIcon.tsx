import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { VerticalTile, theme } from '@apify-packages/ui-components';
import styles from './styles.module.css';
import { Text } from '../Text';
import { Heading } from '../Heading';

interface CardWithIconProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    to: string;
    width?: string;
}

export default function CardWithIcon({ icon, title, description, to, width }: CardWithIconProps) {
    const { siteConfig } = useDocusaurusContext();
    const external = to.startsWith('http');

    const Tile = <VerticalTile style={{ height: '100%' }}
        content={
            <div className={styles.cardContent}>
                <div className={styles.cardContentHeader}>
                    <div className={styles.cardIcon}>{icon}</div>
                    <Heading type='titleM'>{title}</Heading>
                </div>
                <div className={styles.cardContentDescription}>
                    <Text align='left' color={theme.color.neutral.textSubtle}>{description}</Text>
                </div>
            </div>
        }
        isClickable
    />;

    if (external) {
        return (
            <Link to={new URL(to, siteConfig.url).href} style={{ width }}>
                {Tile}
            </Link>
        );
    }

    return (
        <a href={new URL(to, siteConfig.url).href} style={{ width }}>
            {Tile}
        </a>
    );
}
