/**
 * Skeleton Component
 * Provides loading placeholders for:
 * - Movie cards
 * - Watched movie items
 * - Summary information
 * - Customizable dimensions
 * - Animated loading states
 */

import React from "react";

export function Skeleton({ type }) {
  const classes = `skeleton ${type}`;

  return <div className={classes}></div>;
}

export function SkeletonMovie() {
  return (
    <div className="skeleton-movie">
      <Skeleton type="poster" />
      <div className="skeleton-content">
        <Skeleton type="title" />
        <Skeleton type="text" />
      </div>
    </div>
  );
}

export function SkeletonWatchedMovie() {
  return (
    <div className="skeleton-watched-movie">
      <Skeleton type="poster" />
      <div className="skeleton-content">
        <Skeleton type="title" />
        <div className="skeleton-stats">
          <Skeleton type="stat" />
          <Skeleton type="stat" />
          <Skeleton type="stat" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonMovieDetails() {
  return (
    <div className="skeleton-details">
      <div className="skeleton-header">
        <Skeleton type="poster-large" />
        <div className="skeleton-info">
          <Skeleton type="title-large" />
          <Skeleton type="text" />
          <Skeleton type="text" />
          <Skeleton type="text" />
        </div>
      </div>
      <div className="skeleton-overview">
        <Skeleton type="text" />
        <Skeleton type="text" />
        <Skeleton type="text" />
      </div>
    </div>
  );
}

export function SkeletonWatchedSummary() {
  return (
    <div className="skeleton-summary">
      <Skeleton type="title" />
      <div className="skeleton-stats">
        <Skeleton type="stat" />
        <Skeleton type="stat" />
        <Skeleton type="stat" />
      </div>
    </div>
  );
}
