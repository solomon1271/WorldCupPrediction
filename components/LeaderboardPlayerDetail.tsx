"use client";

import { useEffect, useState } from "react";

import type { PlayerStandingDetail, PlayerStandingScope } from "@/lib/player-standing";
import { formatKickoff } from "@/lib/utils";

type LeaderboardPlayerDetailProps = {
  leagueSlug: string;
  playerId: string | null;
  playerName: string | null;
  scope: PlayerStandingScope;
  onClose: () => void;
};

export function LeaderboardPlayerDetail({
  leagueSlug,
  playerId,
  playerName,
  scope,
  onClose
}: LeaderboardPlayerDetailProps) {
  const [detail, setDetail] = useState<PlayerStandingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId) {
      setDetail(null);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function loadDetail() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/leagues/${leagueSlug}/standings/${playerId}?scope=${scope}`,
          {
            credentials: "same-origin",
            signal: controller.signal
          }
        );
        const result = (await response.json()) as { error?: string; detail?: PlayerStandingDetail };

        if (!response.ok) {
          setError(result.error || "Could not load this player profile.");
          setDetail(null);
          return;
        }

        setDetail(result.detail || null);
      } catch (loadError) {
        if (!(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError("Could not load this player profile.");
          setDetail(null);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadDetail();

    return () => controller.abort();
  }, [leagueSlug, playerId, scope]);

  if (!playerId) {
    return null;
  }

  const showTournament = detail?.scope === "group-stage";

  return (
    <div className="leaderboard-detail-backdrop" onClick={onClose}>
      <div
        className="leaderboard-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leaderboard-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="leaderboard-detail__header">
          <div>
            <p className="eyebrow">Player profile</p>
            <h3 id="leaderboard-detail-title">{playerName || detail?.playerName || "Player"}</h3>
          </div>
          <button className="ghost-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        {loading ? <p className="section__copy">Loading picks and points...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        {detail ? (
          <div className="leaderboard-detail__body">
            <div className="leaderboard-detail__summary">
              <div>
                <span>Total points</span>
                <strong>{detail.totalPoints}</strong>
              </div>
              <div>
                <span>From matches</span>
                <strong>{detail.matchPoints}</strong>
              </div>
              {showTournament ? (
                <div>
                  <span>From top picks</span>
                  <strong>{detail.tournamentPoints}</strong>
                </div>
              ) : null}
            </div>

            <section className="leaderboard-detail__section">
              <h4>{detail.scope === "knockout" ? "Knockout picks" : "Group stage picks"}</h4>
              {detail.matches.length === 0 ? (
                <p className="status-note">No finished match results to show yet.</p>
              ) : (
                <div className="leaderboard-detail__list">
                  {detail.matches.map((match) => (
                    <article className="leaderboard-detail__card" key={match.matchId}>
                      <div className="leaderboard-detail__card-head">
                        <strong>
                          {match.homeTeam} vs {match.awayTeam}
                        </strong>
                        <span>{match.points} pts</span>
                      </div>
                      <p className="leaderboard-detail__meta">
                        {match.stage} · {formatKickoff(match.kickoff)}
                      </p>
                      {match.prediction ? (
                        <p className="leaderboard-detail__pick">
                          Pick: {match.prediction.winner}
                          {match.prediction.homeScore !== null && match.prediction.awayScore !== null
                            ? ` · ${match.prediction.homeScore}-${match.prediction.awayScore}`
                            : ""}
                        </p>
                      ) : null}
                      {match.breakdown ? (
                        <div className="prediction-strip score-breakdown__strip">
                          {match.breakdown.items.map((item) => (
                            <div
                              className={`score-breakdown__cell${item.hit ? " score-breakdown__cell--hit" : ""}`}
                              key={item.label}
                            >
                              <span>{item.label}</span>
                              <p className="score-breakdown__values">
                                <strong className="score-breakdown__pick">{item.pickLabel}</strong>
                                {item.resultLabel !== "Not recorded" ? (
                                  <>
                                    <span className="score-breakdown__actual-arrow" aria-hidden="true">
                                      →
                                    </span>
                                    <strong className="score-breakdown__actual">{item.resultLabel}</strong>
                                  </>
                                ) : null}
                              </p>
                              <strong className="score-breakdown__points">
                                {item.points}/{item.maxPoints}
                              </strong>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </section>

            {showTournament ? (
              <section className="leaderboard-detail__section">
                <h4>Top picks</h4>
                <div className="prediction-strip score-breakdown__strip">
                  {detail.tournament.breakdown.map((item) => (
                    <div
                      className={`score-breakdown__cell${item.hit ? " score-breakdown__cell--hit" : ""}`}
                      key={item.label}
                    >
                      <span>{item.label}</span>
                      <strong className="score-breakdown__pick">{item.pickLabel}</strong>
                      <strong className="score-breakdown__points">
                        {item.points}/{item.maxPoints}
                      </strong>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
